---
title: "Using gRPC with Scala - Server Implementation"
date: "2021-03-27"
excerpt: "Handling Unary, Client Side Streaming, Server Side Streaming and Bi-Directional Streaming Calls in gRPC using Scala"
---

## What is RPC?

**Remote Procedure Call (RPC)** is a powerful technique for constructing **distributed, client-server based applications**. It is based on extending the conventional local procedure calling so that the **called procedure need not exist in the same address space as the calling procedure**.

# What is gRPC?

<img src="https://grpc.io/img/landing-2.svg" alt="gRPC Architecture" />

gRPC is a modern open source high performance RPC framework developed by Google and Introduced in 2015 that can run in any environment and communicate to any service in any supported language. It used by many major Internet Companies such as Google, Netflix, Cisco, CoreOS, Juniper etc.

gRPC uses [Protocol Buffers](https://developers.google.com/protocol-buffers) as it's Interface Definition Language.

# Let's get started!

I came upon a problem in my work where I was required to use gRPC with Scala. Being a Software Developer, I knew how to do it in Java very well, but for some engineering reasons I was asked to write the same in Scala. Scala being a JVM language makes it very easy to write very efficient code in a very short footprint. The work that takes 500 lines of code in Java can be done easily in <100 lines in Scala. Due to lack of documentation from ScalaPB on Streaming Calls, I decided to write my on article on this.

## Prerequisites

1. Basic knowledge of Scala
2. An empty scala project set up with [ScalaPB](https://scalapb.github.io/docs/) and [SBT](https://www.scala-sbt.org/)
3. Basic Knowledge of [ProtoBufs](https://developers.google.com/protocol-buffers/docs/overview)

## Creating the Protobuf

Firstly, we need a proto file containing the messages and a service. We'll create a **HelloWorldProto.proto** file inside _src/main/protobuf_ folder.

```protobuf
syntax="proto3";
package in.pbehre.proto;

message HelloRequest {
  string name=1;
}
message HelloResponse {
  string welcome_message=1;
}
service HelloWorld {
  rpc sayHello(HelloRequest) returns (HelloResponse);
  rpc clientStream(stream HelloRequest) returns (HelloResponse);
  rpc serverStream(HelloRequest) returns (stream HelloResponse);
  rpc streamHello(stream HelloRequest) returns (stream HelloResponse);
}
```

- _HelloRequest_ - Message to be sent as request to the server
- _HelloResponse_ - Message to be sent as Response to the client
- _HelloWorld_ - gRPC service containing different methods:
  - _sayHello_ - Unary Call
  - _clientStream_ - Client Side Streaming
  - _serverStream_ - Server Side Streaming
  - _streamHello_ - Bi-Directional Streaming

## Implementing the service - _HelloWorld_

Create a new file **HelloService.scala** in _src/main/scala/[your package]/_ with the below content:

```scala
package in.pbehre.scala

import in.pbehre.proto.HelloWorldProto._
import io.grpc.stub.StreamObserver

import scala.concurrent.Future

class HelloService extends HelloWorldGrpc .HelloWorld {
	//Service to implement calls
}
```

This is the basic service structure, needs to extend the HelloWorldGrpc.HelloWorld Base Implementation Class. Let's go ahead and override the methods

### Unary Call - sayHello

This call takes a single _HelloRequest_ Object and Returns a _Future_ with _HelloResponse_ Object.

```scala
override def sayHello(request: HelloRequest): Future[HelloResponse] = {
    val name : String = request.name
    val reply = HelloResponse(welcomeMessage = "Welcome, " + name)
    Future.successful(reply)
}
```

### Client Side Streaming - clientStream

This will take a stream of objects from the client in a request observer, and then return them back to the client once the stream is end/committed in a single _HelloResponse_ Object. Only one request session is used to stream content to the server.

```scala
override def clientStream(responseObserver: StreamObserver[HelloResponse]): StreamObserver[HelloRequest] = {
    var count: Int = 0
    var names: String = ""
    val requestObserver: StreamObserver[HelloRequest] = new StreamObserver[HelloRequest] {
      override def onNext(value: HelloRequest): Unit = {
        println("Received request: " + value.name)
        count = count + 1
        names+= value.name + ", "
      }
      override def onError(t: Throwable): Unit = {
        println(t)
      }
      override def onCompleted(): Unit = {
        responseObserver.onNext(HelloResponse("Welcome, " + names + "\nTotal Count: " + count))
        responseObserver.onCompleted()
        println("clientStream::onCompleted()")
      }
    }
    requestObserver
  }
```

### Server Side Streaming - serverStream

Will take a single request _HelloRequest_ object which will establish the request and thanks to http2.0, the grpc function will return a multiple stream of _HelloResponse_ object in the same request.

```scala
override def serverStream(request: HelloRequest, responseObserver: StreamObserver[HelloResponse]): Unit = {
    val values : List[String] = List(
      "First Stream packet",
      "Second stream packet",
      "Third Stream packet",
      "Fourth Stream packet"
    )
    values.foreach(s => responseObserver.onNext(HelloResponse(welcomeMessage = s)))
    responseObserver.onCompleted()
  }
```

### Bi-Directional Streaming - streamHello

Takes a stream of _HelloRequest_ Objects and returns a stream of _HelloResponse_ objects

```scala
override def streamHello(responseObserver: StreamObserver[HelloResponse]): StreamObserver[HelloRequest] = {
    val requestObserver: StreamObserver[HelloRequest] = new StreamObserver[HelloRequest] {
      override def onNext(value: HelloRequest): Unit = {
        println("Received a Request: " + value.name)
        responseObserver.onNext(HelloResponse(welcomeMessage = "Hello World, " + value.name))
      }


      override def onError(t: Throwable): Unit = {
        println(t)
      }

      override def onCompleted(): Unit = {
        println("Service completed")
      }
    }
    requestObserver
  }
```

#### That's it!

#### Your final file service file should look like:

```scala
package in.pbehre.scala

import in.pbehre.proto.HelloWorldProto._
import io.grpc.stub.StreamObserver

import scala.concurrent.Future

class HelloService extends HelloWorldGrpc .HelloWorld {
  override def sayHello(request: HelloRequest): Future[HelloResponse] = {
    val name : String = request.name
    val reply = HelloResponse(welcomeMessage = "Welcome, " + name)
    Future.successful(reply)
  }

  override def streamHello(responseObserver: StreamObserver[HelloResponse]): StreamObserver[HelloRequest] = {
    val requestObserver: StreamObserver[HelloRequest] = new StreamObserver[HelloRequest] {
      override def onNext(value: HelloRequest): Unit = {
        println("Received a Request: " + value.name)
        responseObserver.onNext(HelloResponse(welcomeMessage = "Hello World, " + value.name))
      }


      override def onError(t: Throwable): Unit = {
        println(t)
      }

      override def onCompleted(): Unit = {
        println("Service completed")
      }
    }
    requestObserver
  }

  override def clientStream(responseObserver: StreamObserver[HelloResponse]): StreamObserver[HelloRequest] = {
    var count: Int = 0
    var names: String = ""
    val requestObserver: StreamObserver[HelloRequest] = new StreamObserver[HelloRequest] {
      override def onNext(value: HelloRequest): Unit = {
        println("Received request: " + value.name)
        count = count + 1
        names+= value.name + ", "
      }

      override def onError(t: Throwable): Unit = {
        println(t)
      }

      override def onCompleted(): Unit = {
        responseObserver.onNext(HelloResponse("Welcome, " + names + "\nTotal Count: " + count))
        responseObserver.onCompleted()
        println("clientStream::onCompleted()")
      }
    }

    requestObserver
  }

  override def serverStream(request: HelloRequest, responseObserver: StreamObserver[HelloResponse]): Unit = {
    val values : List[String] = List(
      "First Stream packet",
      "Second stream packet",
      "Third Stream packet",
      "Fourth Stream packet"
    )

    values.foreach(s => responseObserver.onNext(HelloResponse(welcomeMessage = s)))
    responseObserver.onCompleted()
  }
}
```

####

## Implementing the GRPC Server

Create a new file **HelloServer.scala** in _src/main/scala/[your package]/_ with the below content:

```scala
package in.pbehre.scala


import in.pbehre.proto.HelloWorldProto._

import io.grpc.{Server, ServerBuilder}

import java.util.logging.{LogManager, Logger}
import scala.concurrent.ExecutionContext

object App {
  val logger: Logger = Logger.getLogger(classOf[App].getName)
  val port = 50051

  def main(args: Array[String]): Unit = {
    val server = new HelloWorldServer(ExecutionContext.global)
    server.start
    server.blockUntilShutdown
  }
}
class HelloWorldServer(executionContext: ExecutionContext) { self =>
  private[this] var server: Server = null

  def start(): Unit = {
    server = ServerBuilder
      .forPort(App.port)
      .addService(HelloWorldGrpc.bindService(new HelloService, executionContext))
      .build()
      .start()
    App.logger.info("Starting server on port: " + App.port)
    sys.addShutdownHook {
      System.err.println("*** shutting down gRPC server since JVM is shutting down")
      self.stop()
      System.err.println("*** server shut down")
    }
  }
  def stop(): Unit = {
    if (server != null) {
      server.shutdown()
    }
  }

  def blockUntilShutdown(): Unit = {
    if (server != null) {
      server.awaitTermination()
    }
  }
}
```

#### That's it! You're done with the code.

Client Implementation coming soon!

You can find the code and a sample project in this repository: [Github](https://github.com/pavitra14/grpc_hello_server)
