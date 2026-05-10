import { listS3Objects } from '../utils/s3';

async function main() {
  try {
    console.log('--- Inspecting S3 Bucket ---');

    console.log('\n[Blogs]');
    const blogs = await listS3Objects('blogs/');
    blogs.forEach((b) => console.log(` - ${b.Key} (${b.Size} bytes)`));

    console.log('\n[Authors]');
    const authors = await listS3Objects('authors/');
    authors.forEach((a) => console.log(` - ${a.Key} (${a.Size} bytes)`));

    console.log('\n[Settings]');
    const settings = await listS3Objects('settings/');
    settings.forEach((s) => console.log(` - ${s.Key} (${s.Size} bytes)`));

    console.log('\n[Media]');
    const media = await listS3Objects('media/');
    media.forEach((m) => console.log(` - ${m.Key} (${m.Size} bytes)`));

    console.log('\n[Root / Others]');
    const all = await listS3Objects('');
    const others = all.filter(
      (o) =>
        !o.Key?.startsWith('blogs/') &&
        !o.Key?.startsWith('authors/') &&
        !o.Key?.startsWith('settings/') &&
        !o.Key?.startsWith('media/')
    );
    others.forEach((o) => console.log(` - ${o.Key} (${o.Size} bytes)`));
  } catch (error) {
    console.error('Error inspecting S3:', error);
  }
}

main();
