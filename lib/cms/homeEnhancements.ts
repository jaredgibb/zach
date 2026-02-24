import type {
      CmsBlock,
      CmsCtaBandBlock,
      CmsHeroBlock,
      CmsImageTextBlock,
      CmsInsuranceStripBlock,
      CmsLinksBlock,
      CmsPage,
      CmsPageSnapshot,
      CmsProcessStepsBlock,
      CmsTeamGridBlock,
} from '@/lib/cms/types';
import { buildSiteUrl } from '@/lib/cms/server';
import { businessInfo, insuranceProviders } from '@/lib/data';

const HOME_HERO_IMAGE = '/images/stock-therapy/hero.jpg';
const HOME_WELLBEING_IMAGE = '/images/stock-therapy/stock-g-2.png';

function normalizeValue(value: string): string {
      return value.trim().toLowerCase();
}

function looksPlaceholderTeamIntro(value: string): boolean {
      const normalized = normalizeValue(value);
      return normalized.includes('bios and photos will be added soon') || normalized.includes('photos will be added soon');
}

function updateHeroBlock(block: CmsHeroBlock): CmsHeroBlock {
      return {
            ...block,
            data: {
                  ...block.data,
                  theme: 'dark',
                  backgroundImageUrl: HOME_HERO_IMAGE,
                  backgroundImageAlt:
                        'African American man seated in a warm, comfortable therapy office with natural light',
                  overlayOpacity: 0.46,
                  ctaPrimary: block.data.ctaPrimary
                        ? {
                                ...block.data.ctaPrimary,
                                label: 'Request a Consultation',
                          }
                        : {
                                label: 'Request a Consultation',
                                href: '/contact',
                          },
            },
      };
}

function updateImageTextBlock(block: CmsImageTextBlock): CmsImageTextBlock {
      return {
            ...block,
            data: {
                  ...block.data,
                  imageUrl: HOME_WELLBEING_IMAGE,
                  imageAlt:
                        'African American therapist meeting with an African American couple in a calm, sunlit therapy office',
                  imageSide: block.data.imageSide || 'right',
            },
      };
}

function updateProcessStepsBlock(block: CmsProcessStepsBlock): CmsProcessStepsBlock {
      const nextSteps = block.data.steps.map((step, index) => {
            if (index !== 0) {
                  return step;
            }

            const normalizedTitle = normalizeValue(step.title);
            if (normalizedTitle.includes('request') || normalizedTitle.includes('schedule')) {
                  return {
                        ...step,
                        title: 'Reach out',
                        description:
                              step.description ||
                              'Share your availability, insurance, and therapist preferences. We will follow up with next steps.',
                  };
            }

            return step;
      });

      return {
            ...block,
            data: {
                  ...block.data,
                  steps: nextSteps,
            },
      };
}

function updateTeamGridBlock(block: CmsTeamGridBlock): CmsTeamGridBlock {
      const existingMembers = block.data.members.filter((member) => member.name.trim());

      return {
            ...block,
            data: {
                  ...block.data,
                  title: block.data.title || 'Meet Our Therapists',
                  intro:
                        !block.data.intro || looksPlaceholderTeamIntro(block.data.intro)
                              ? 'A compassionate team providing evidence-informed care across anxiety, trauma, relationships, and life transitions.'
                              : block.data.intro,
                  columns: 3,
                  members: existingMembers.map((member) => ({
                        ...member,
                        profileHref: member.profileHref || '/therapists',
                  })),
            },
      };
}

function updateInsuranceStripBlock(block: CmsInsuranceStripBlock): CmsInsuranceStripBlock {
      return {
            ...block,
            data: {
                  ...block.data,
                  title: 'Insurance and scheduling',
                  intro: 'We work with many major insurance plans and can help you understand next steps before your first appointment.',
                  providers: insuranceProviders.slice(0, 8),
                  note: 'Contact us if you do not see your plan listed and we can confirm coverage options.',
                  ctaLabel: 'Request a Consultation',
                  ctaHref: '/contact',
            },
      };
}

function updateCtaBandBlock(block: CmsCtaBandBlock): CmsCtaBandBlock {
      return {
            ...block,
            data: {
                  ...block.data,
                  heading: block.data.heading || 'Ready to take the next step?',
                  body: 'Reach out for a conversation about your goals, insurance, and available consultation options.',
                  buttonLabel: 'Start Your Journey',
                  buttonHref: '/contact',
                  style: 'dark',
            },
      };
}

function createServicesLinksBlock(): CmsLinksBlock {
      return {
            id: 'dps-home-services-grid',
            type: 'cms_links',
            visible: true,
            data: {
                  title: 'Our Services',
                  intro:
                        'Supportive, practical therapy options tailored to your needs, relationships, and stage of life.',
                  layout: 'grid',
                  items: [],
            },
      };
}

function ensureServicesBlock(blocks: CmsBlock[]): CmsBlock[] {
      const nextBlocks = [...blocks];
      const existingIndex = nextBlocks.findIndex((block) => {
            if (block.type !== 'cms_links') {
                  return false;
            }

            const hasServiceHref = block.data.items.some((item) => item.href.trim() === '/services');
            return hasServiceHref || normalizeValue(block.data.title).includes('service');
      });

      if (existingIndex >= 0) {
            const existing = nextBlocks[existingIndex] as CmsLinksBlock;
            nextBlocks[existingIndex] = {
                  ...existing,
                  data: {
                        ...existing.data,
                        title: 'Our Services',
                        intro:
                              existing.data.intro ||
                              'Supportive, practical therapy options tailored to your needs, relationships, and stage of life.',
                        layout: 'grid',
                        items: existing.data.items,
                  },
            };
            return nextBlocks;
      }

      const teamIndex = nextBlocks.findIndex((block) => block.type === 'team_grid');
      const faqIndex = nextBlocks.findIndex((block) => block.type === 'faq');
      const insertIndex = teamIndex >= 0 ? teamIndex + 1 : faqIndex >= 0 ? faqIndex : nextBlocks.length;
      nextBlocks.splice(insertIndex, 0, createServicesLinksBlock());
      return nextBlocks;
}

function moveInsuranceStripBelowHero(blocks: CmsBlock[]): CmsBlock[] {
      const nextBlocks = [...blocks];
      const heroIndex = nextBlocks.findIndex((block) => block.type === 'hero');
      const insuranceIndex = nextBlocks.findIndex((block) => block.type === 'insurance_strip');

      if (heroIndex < 0 || insuranceIndex < 0 || insuranceIndex === heroIndex + 1) {
            return nextBlocks;
      }

      const [insuranceBlock] = nextBlocks.splice(insuranceIndex, 1);
      nextBlocks.splice(heroIndex + 1, 0, insuranceBlock);
      return nextBlocks;
}

function enhanceHomeSnapshot(snapshot: CmsPageSnapshot): CmsPageSnapshot {
      let nextBlocks = snapshot.blocks.map((block) => structuredClone(block));
      let imageTextUpdated = false;

      nextBlocks = nextBlocks.map((block) => {
            switch (block.type) {
                  case 'hero':
                        return updateHeroBlock(block);
                  case 'image_text':
                        if (imageTextUpdated) {
                              return block;
                        }
                        imageTextUpdated = true;
                        return updateImageTextBlock(block);
                  case 'process_steps':
                        return updateProcessStepsBlock(block);
                  case 'team_grid':
                        return updateTeamGridBlock(block);
                  case 'insurance_strip':
                        return updateInsuranceStripBlock(block);
                  case 'cta_band':
                        return updateCtaBandBlock(block);
                  default:
                        return block;
            }
      });

      nextBlocks = ensureServicesBlock(nextBlocks);
      nextBlocks = moveInsuranceStripBelowHero(nextBlocks);

      return {
            ...snapshot,
            seo: {
                  ...snapshot.seo,
                  ogImageUrl: snapshot.seo.ogImageUrl || HOME_HERO_IMAGE,
            },
            blocks: nextBlocks,
      };
}

function isHomePage(page: CmsPage): boolean {
      return page.path === '/' || normalizeValue(page.slug) === 'home';
}

export function enhanceCmsHomePage(page: CmsPage): CmsPage {
      if (!isHomePage(page)) {
            return page;
      }

      return {
            ...page,
            draft: enhanceHomeSnapshot(page.draft),
            published: page.published ? enhanceHomeSnapshot(page.published) : null,
      };
}

export function buildHomeLocalBusinessSchema(description: string) {
      return {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': buildSiteUrl('/#local-business'),
            name: businessInfo.name,
            url: buildSiteUrl('/'),
            telephone: businessInfo.phone,
            email: businessInfo.email,
            description,
            areaServed: ['Kalamazoo, MI'],
            address: {
                  '@type': 'PostalAddress',
                  streetAddress: businessInfo.address,
                  addressLocality: businessInfo.city,
                  addressRegion: businessInfo.state,
                  postalCode: businessInfo.zip,
                  addressCountry: 'US',
            },
      };
}
