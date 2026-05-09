import siteMetadata from '@/data/siteMetadata';
import Twemoji from '@/components/ui/Twemoji';

const Heading = () => {
  return (
    <h1 className="text-3xl leading-snug font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-200">
      I'm{' '}
      <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text font-bold text-transparent">
        {siteMetadata.fullName}
      </span>{' '}
      - a dedicated{' '}
      <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent">
        Software Development Engineer
      </span>{' '}
      at Amazon
      <span className="hidden">Bengaluru, IN</span>
      <span className="absolute ml-2 inline-flex pt-[3px] text-2xl">
        <Twemoji emoji="🇮🇳" />
      </span>
    </h1>
  );
};

export default Heading;
