import type readingTime from 'reading-time';

import type { StatsType } from '@prisma/client';
import type GiscusConfigs from './giscus-configs.type';

export type ReadingTime = ReturnType<typeof readingTime>;

export interface BlogMetaProps {
  date: string;
  slug: string;
  readingTime: ReadingTime;
}

export interface ViewCounterProps {
  slug: string;
  type: StatsType;
  className?: string;
}

export interface CommentsProps {
  className?: string;
  configs?: Partial<GiscusConfigs>;
}

export interface ScrollButtonProps {
  onClick: () => void;
  ariaLabel: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
