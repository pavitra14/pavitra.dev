import Pre from 'pliny/ui/Pre.js';
import TOCInline from 'pliny/ui/TOCInline.js';
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm.js';
import type { MDXComponents } from 'mdx/types';

import { Link, TableWrapper } from '@/components/ui';

import Image from '@/components/ui/Image';

const components: MDXComponents = {
  Image,
  TOCInline,
  a: Link,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
};

export default components;
