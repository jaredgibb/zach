export type CmsPageKind = 'system' | 'custom';

export type CmsPageStatus = 'draft' | 'published' | 'unpublished';

export type CmsBlockType =
      | 'hero'
      | 'rich_text'
      | 'image_text'
      | 'faq'
      | 'cta_band'
      | 'cms_links'
      | 'image_carousel';

export interface CmsCtaLink {
      label: string;
      href: string;
}

export interface CmsHeroBlockData {
      headline: string;
      subheadline: string;
      alignment: 'left' | 'center';
      theme: 'primary' | 'light' | 'dark';
      ctaPrimary: CmsCtaLink | null;
      ctaSecondary: CmsCtaLink | null;
}

export interface CmsRichTextBlockData {
      yoopta: Record<string, unknown> | null;
      html: string;
      plainText: string;
}

export interface CmsImageTextBlockData {
      headline: string;
      body: string;
      imageUrl: string;
      imageAlt: string;
      imageSide: 'left' | 'right';
}

export interface CmsFaqItem {
      question: string;
      answer: string;
}

export interface CmsFaqBlockData {
      title: string;
      enableSchema: boolean;
      items: CmsFaqItem[];
}

export interface CmsCtaBandBlockData {
      heading: string;
      body: string;
      buttonLabel: string;
      buttonHref: string;
      style: 'primary' | 'light' | 'dark';
}

export interface CmsLinksItem {
      label: string;
      href: string;
      description: string;
}

export interface CmsLinksBlockData {
      title: string;
      intro: string;
      layout: 'list' | 'grid';
      items: CmsLinksItem[];
}

export interface CmsCarouselItem {
      imageUrl: string;
      imageAlt: string;
      caption: string;
      href: string;
}

export interface CmsImageCarouselBlockData {
      title: string;
      autoplay: boolean;
      intervalMs: number;
      items: CmsCarouselItem[];
}

interface CmsBaseBlock<TType extends CmsBlockType, TData> {
      id: string;
      type: TType;
      visible: boolean;
      data: TData;
}

export type CmsHeroBlock = CmsBaseBlock<'hero', CmsHeroBlockData>;

export type CmsRichTextBlock = CmsBaseBlock<'rich_text', CmsRichTextBlockData>;

export type CmsImageTextBlock = CmsBaseBlock<'image_text', CmsImageTextBlockData>;

export type CmsFaqBlock = CmsBaseBlock<'faq', CmsFaqBlockData>;

export type CmsCtaBandBlock = CmsBaseBlock<'cta_band', CmsCtaBandBlockData>;

export type CmsLinksBlock = CmsBaseBlock<'cms_links', CmsLinksBlockData>;

export type CmsImageCarouselBlock = CmsBaseBlock<'image_carousel', CmsImageCarouselBlockData>;

export type CmsBlock =
      | CmsHeroBlock
      | CmsRichTextBlock
      | CmsImageTextBlock
      | CmsFaqBlock
      | CmsCtaBandBlock
      | CmsLinksBlock
      | CmsImageCarouselBlock;

export interface CmsPageSeo {
      metaTitle: string;
      metaDescription: string;
      canonicalPath: string;
      ogTitle: string;
      ogDescription: string;
      ogImageUrl: string;
      noIndex: boolean;
      noFollow: boolean;
      schemaJson: string;
}

export interface CmsPageNav {
      showInHeader: boolean;
      headerLabel: string;
      headerOrder: number;
      showInFooter: boolean;
      footerLabel: string;
      footerOrder: number;
}

export interface CmsPageSnapshot {
      title: string;
      blocks: CmsBlock[];
      seo: CmsPageSeo;
      nav: CmsPageNav;
}

export interface CmsPage {
      id: string;
      kind: CmsPageKind;
      status: CmsPageStatus;
      slug: string;
      path: string;
      createdAt: string;
      createdBy: string | null;
      updatedAt: string;
      updatedBy: string | null;
      publishedAt: string | null;
      publishedBy: string | null;
      draft: CmsPageSnapshot;
      published: CmsPageSnapshot | null;
}

export interface CmsPageListItem {
      id: string;
      kind: CmsPageKind;
      status: CmsPageStatus;
      slug: string;
      path: string;
      title: string;
      updatedAt: string;
      publishedAt: string | null;
}

export interface CmsHeaderNavItem {
      id: string;
      label: string;
      href: string;
      order: number;
}

export interface CmsFooterNavItem {
      id: string;
      label: string;
      href: string;
      order: number;
}
