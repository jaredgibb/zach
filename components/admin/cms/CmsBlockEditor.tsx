'use client';

import { CSS } from '@dnd-kit/utilities';
import {
      closestCenter,
      DndContext,
      type DragEndEvent,
      KeyboardSensor,
      PointerSensor,
      useSensor,
      useSensors,
} from '@dnd-kit/core';
import {
      arrayMove,
      SortableContext,
      sortableKeyboardCoordinates,
      useSortable,
      verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import {
      therapistBioMarks,
      therapistBioPlugins,
      therapistBioTools,
} from '@/lib/yooptaTherapistBio';
import { createDefaultBlock } from '@/lib/cms/defaults';
import { plainTextToHtml } from '@/lib/cms/rich-text';
import type {
      CmsBlock,
      CmsBlockType,
      CmsFaqBlock,
      CmsImageCarouselBlock,
      CmsLinksBlock,
      CmsInsuranceStripBlock,
      CmsPricingCardsBlock,
      CmsProcessStepsBlock,
      CmsRichTextBlock,
      CmsTeamGridBlock,
      CmsTestimonialsBlock,
      CmsTrustBarBlock,
      CmsVideoEmbedBlock,
} from '@/lib/cms/types';

interface CmsLinkSuggestion {
      label: string;
      href: string;
}

interface CmsBlockEditorProps {
      blocks: CmsBlock[];
      onChange: (nextBlocks: CmsBlock[]) => void;
      cmsLinkSuggestions?: CmsLinkSuggestion[];
}

const CMS_LINK_SUGGESTIONS_DATALIST_ID = 'cms-link-suggestions';

function SortableShell({
      block,
      children,
}: {
      block: CmsBlock;
      children: React.ReactNode;
}) {
      const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
      } = useSortable({ id: block.id });

      const style = {
            transform: CSS.Transform.toString(transform),
            transition,
      };

      return (
            <div
                  ref={setNodeRef}
                  style={style}
                  className={`rounded-lg border bg-white p-5 shadow-sm ${
                        isDragging ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
                  }`}
            >
                  <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                              <button
                                    type="button"
                                    {...attributes}
                                    {...listeners}
                                    className="inline-flex h-9 w-9 cursor-grab items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-primary-500 hover:text-primary-600"
                                    title="Drag to reorder"
                              >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M8 12h8M8 18h8" />
                                    </svg>
                              </button>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                    {block.type.replace('_', ' ')}
                              </span>
                        </div>
                  </div>

                  {children}
            </div>
      );
}

function BlockHeaderActions({
      block,
      onChange,
      onRemove,
}: {
      block: CmsBlock;
      onChange: (nextBlock: CmsBlock) => void;
      onRemove: () => void;
}) {
      return (
            <div className="mb-4 flex items-center justify-end gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                              type="checkbox"
                              checked={block.visible}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          visible: event.target.checked,
                                    })
                              }
                        />
                        Visible
                  </label>
                  <button
                        type="button"
                        onClick={onRemove}
                        className="text-sm font-medium text-red-600 hover:underline"
                  >
                        Remove
                  </button>
            </div>
      );
}

function HeroFields({
      block,
      onChange,
}: {
      block: Extract<CmsBlock, { type: 'hero' }>;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                        <input
                              type="text"
                              value={block.data.headline}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, headline: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
                        <textarea
                              rows={3}
                              value={block.data.subheadline}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, subheadline: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                              <select
                                    value={block.data.alignment}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: {
                                                      ...block.data,
                                                      alignment: event.target.value as 'left' | 'center',
                                                },
                                          })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                              >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                              </select>
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                              <select
                                    value={block.data.theme}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: {
                                                      ...block.data,
                                                      theme: event.target.value as 'primary' | 'light' | 'dark',
                                                },
                                          })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                              >
                                    <option value="primary">Primary</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                              </select>
                        </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-3">
                              <p className="text-sm font-semibold text-gray-800 mb-2">Primary CTA</p>
                              <input
                                    type="text"
                                    placeholder="Label"
                                    value={block.data.ctaPrimary?.label ?? ''}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: {
                                                      ...block.data,
                                                      ctaPrimary: {
                                                            label: event.target.value,
                                                            href: block.data.ctaPrimary?.href ?? '/',
                                                      },
                                                },
                                          })
                                    }
                                    className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                              <input
                                    type="text"
                                    list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                                    placeholder="Href"
                                    value={block.data.ctaPrimary?.href ?? ''}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: {
                                                      ...block.data,
                                                      ctaPrimary: {
                                                            label: block.data.ctaPrimary?.label ?? 'Learn more',
                                                            href: event.target.value,
                                                      },
                                                },
                                          })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                        </div>

                        <div className="rounded-lg border border-gray-200 p-3">
                              <p className="text-sm font-semibold text-gray-800 mb-2">Secondary CTA</p>
                              <input
                                    type="text"
                                    placeholder="Label"
                                    value={block.data.ctaSecondary?.label ?? ''}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: {
                                                      ...block.data,
                                                      ctaSecondary: {
                                                            label: event.target.value,
                                                            href: block.data.ctaSecondary?.href ?? '/',
                                                      },
                                                },
                                          })
                                    }
                                    className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                              <input
                                    type="text"
                                    list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                                    placeholder="Href"
                                    value={block.data.ctaSecondary?.href ?? ''}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: {
                                                      ...block.data,
                                                      ctaSecondary: {
                                                            label: block.data.ctaSecondary?.label ?? 'Learn more',
                                                            href: event.target.value,
                                                      },
                                                },
                                          })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                        </div>
                  </div>
            </div>
      );
}

function TrustBarFields({
      block,
      onChange,
}: {
      block: CmsTrustBarBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      const maxItems = 6;

      return (
            <div className="space-y-4">
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                              type="text"
                              value={block.data.title}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, title: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>

                  <div className="space-y-3">
                        {block.data.items.map((item, index) => (
                              <div key={`${block.id}-trust-item-${index}`} className="rounded-lg border border-gray-200 p-3">
                                    <input
                                          type="text"
                                          placeholder="Chip label"
                                          value={item.label}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      label: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: { ...block.data, items: nextItems },
                                                });
                                          }}
                                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <textarea
                                          rows={2}
                                          placeholder="Short supporting description"
                                          value={item.description}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      description: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: { ...block.data, items: nextItems },
                                                });
                                          }}
                                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <div className="mt-2 text-right">
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextItems = block.data.items.filter((_, itemIndex) => itemIndex !== index);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items:
                                                                        nextItems.length > 0
                                                                              ? nextItems
                                                                              : [{ label: '', description: '' }],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove item
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        disabled={block.data.items.length >= maxItems}
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          items: [...block.data.items, { label: '', description: '' }],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                        + Add trust chip ({block.data.items.length}/{maxItems})
                  </button>
            </div>
      );
}

function ProcessStepsFields({
      block,
      onChange,
}: {
      block: CmsProcessStepsBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      const maxSteps = 5;

      return (
            <div className="space-y-4">
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                              type="text"
                              value={block.data.title}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, title: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
                        <textarea
                              rows={2}
                              value={block.data.intro}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, intro: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>

                  <div className="space-y-3">
                        {block.data.steps.map((step, index) => (
                              <div key={`${block.id}-process-step-${index}`} className="rounded-lg border border-gray-200 p-3">
                                    <input
                                          type="text"
                                          placeholder={`Step ${index + 1} title`}
                                          value={step.title}
                                          onChange={(event) => {
                                                const nextSteps = [...block.data.steps];
                                                nextSteps[index] = {
                                                      ...nextSteps[index],
                                                      title: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: { ...block.data, steps: nextSteps },
                                                });
                                          }}
                                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <textarea
                                          rows={2}
                                          placeholder="Step description"
                                          value={step.description}
                                          onChange={(event) => {
                                                const nextSteps = [...block.data.steps];
                                                nextSteps[index] = {
                                                      ...nextSteps[index],
                                                      description: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: { ...block.data, steps: nextSteps },
                                                });
                                          }}
                                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <div className="mt-2 text-right">
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextSteps = block.data.steps.filter((_, stepIndex) => stepIndex !== index);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  steps:
                                                                        nextSteps.length > 0
                                                                              ? nextSteps
                                                                              : [{ title: '', description: '' }],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove step
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        disabled={block.data.steps.length >= maxSteps}
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          steps: [...block.data.steps, { title: '', description: '' }],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                        + Add step ({block.data.steps.length}/{maxSteps})
                  </button>
            </div>
      );
}

function InsuranceStripFields({
      block,
      onChange,
}: {
      block: CmsInsuranceStripBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      const maxProviders = 24;

      return (
            <div className="space-y-4">
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                              type="text"
                              value={block.data.title}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, title: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
                        <textarea
                              rows={2}
                              value={block.data.intro}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, intro: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Note</label>
                        <textarea
                              rows={2}
                              value={block.data.note}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, note: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label</label>
                              <input
                                    type="text"
                                    value={block.data.ctaLabel}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: { ...block.data, ctaLabel: event.target.value },
                                          })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Href</label>
                              <input
                                    type="text"
                                    list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                                    value={block.data.ctaHref}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: { ...block.data, ctaHref: event.target.value },
                                          })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                        </div>
                  </div>

                  <div className="space-y-3">
                        {block.data.providers.map((provider, index) => (
                              <div key={`${block.id}-provider-${index}`} className="flex gap-3">
                                    <input
                                          type="text"
                                          value={provider}
                                          onChange={(event) => {
                                                const nextProviders = [...block.data.providers];
                                                nextProviders[index] = event.target.value;
                                                onChange({
                                                      ...block,
                                                      data: { ...block.data, providers: nextProviders },
                                                });
                                          }}
                                          placeholder="Insurance provider"
                                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <button
                                          type="button"
                                          onClick={() => {
                                                const nextProviders = block.data.providers.filter((_, providerIndex) => providerIndex !== index);
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            providers: nextProviders.length > 0 ? nextProviders : [''],
                                                      },
                                                });
                                          }}
                                          className="text-sm font-medium text-red-600 hover:underline"
                                    >
                                          Remove
                                    </button>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        disabled={block.data.providers.length >= maxProviders}
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: { ...block.data, providers: [...block.data.providers, ''] },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                        + Add provider ({block.data.providers.length}/{maxProviders})
                  </button>
            </div>
      );
}

function RichTextFields({
      block,
      onChange,
}: {
      block: CmsRichTextBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      const editor = useMemo(() => createYooptaEditor(), []);

      return (
            <div className="space-y-3">
                  <YooptaEditor
                        editor={editor}
                        plugins={therapistBioPlugins}
                        marks={therapistBioMarks}
                        tools={therapistBioTools}
                        value={(block.data.yoopta ?? {}) as never}
                        onChange={(value) => {
                              const plainText = editor.getPlainText(value as never).trim();
                              onChange({
                                    ...block,
                                    data: {
                                          yoopta: value as Record<string, unknown>,
                                          plainText,
                                          html: plainTextToHtml(plainText),
                                    },
                              });
                        }}
                        autoFocus={false}
                        style={{
                              width: '100%',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              padding: '0.75rem',
                              minHeight: 180,
                        }}
                  />
                  <p className="text-xs text-gray-500">
                        Rich text content is stored with a plain HTML snapshot for SEO-friendly rendering.
                  </p>
            </div>
      );
}

function ImageTextFields({
      block,
      onChange,
}: {
      block: Extract<CmsBlock, { type: 'image_text' }>;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Headline"
                        value={block.data.headline}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: { ...block.data, headline: event.target.value },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <textarea
                        rows={4}
                        placeholder="Body"
                        value={block.data.body}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: { ...block.data, body: event.target.value },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                        <input
                              type="text"
                              placeholder="Image URL"
                              value={block.data.imageUrl}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, imageUrl: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        <input
                              type="text"
                              placeholder="Image alt text"
                              value={block.data.imageAlt}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, imageAlt: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>
                  <select
                        value={block.data.imageSide}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          imageSide: event.target.value as 'left' | 'right',
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                        <option value="right">Image right</option>
                        <option value="left">Image left</option>
                  </select>
            </div>
      );
}

function FaqFields({
      block,
      onChange,
}: {
      block: CmsFaqBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="FAQ section title"
                        value={block.data.title}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: { ...block.data, title: event.target.value },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                              type="checkbox"
                              checked={block.data.enableSchema}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, enableSchema: event.target.checked },
                                    })
                              }
                        />
                        Include FAQ schema markup
                  </label>

                  <div className="space-y-3">
                        {block.data.items.map((item, index) => (
                              <div key={`${block.id}-faq-${index}`} className="rounded-lg border border-gray-200 p-3">
                                    <input
                                          type="text"
                                          placeholder="Question"
                                          value={item.question}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      question: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: { ...block.data, items: nextItems },
                                                });
                                          }}
                                          className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <textarea
                                          rows={3}
                                          placeholder="Answer"
                                          value={item.answer}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      answer: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: { ...block.data, items: nextItems },
                                                });
                                          }}
                                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <div className="mt-2 text-right">
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextItems = block.data.items.filter((_, itemIndex) => itemIndex !== index);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems.length > 0 ? nextItems : [{ question: '', answer: '' }],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove item
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          items: [...block.data.items, { question: '', answer: '' }],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline"
                  >
                        + Add FAQ item
                  </button>
            </div>
      );
}

function CtaBandFields({
      block,
      onChange,
}: {
      block: Extract<CmsBlock, { type: 'cta_band' }>;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Heading"
                        value={block.data.heading}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: { ...block.data, heading: event.target.value },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <textarea
                        rows={3}
                        placeholder="Body"
                        value={block.data.body}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: { ...block.data, body: event.target.value },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                        <input
                              type="text"
                              placeholder="Button label"
                              value={block.data.buttonLabel}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, buttonLabel: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        <input
                              type="text"
                              list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                              placeholder="Button href"
                              value={block.data.buttonHref}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: { ...block.data, buttonHref: event.target.value },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                  </div>
                  <select
                        value={block.data.style}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          style: event.target.value as 'primary' | 'light' | 'dark',
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                        <option value="primary">Primary</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                  </select>
            </div>
      );
}

function CmsLinksFields({
      block,
      onChange,
}: {
      block: CmsLinksBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Section title"
                        value={block.data.title}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          title: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <textarea
                        rows={3}
                        placeholder="Intro"
                        value={block.data.intro}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          intro: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <select
                        value={block.data.layout}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          layout: event.target.value as 'list' | 'grid',
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                  </select>

                  <div className="space-y-3">
                        {block.data.items.map((item, index) => (
                              <div key={`${block.id}-link-${index}`} className="rounded-lg border border-gray-200 p-3">
                                    <input
                                          type="text"
                                          placeholder="Label"
                                          value={item.label}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      label: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            items: nextItems,
                                                      },
                                                });
                                          }}
                                          className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <input
                                          type="text"
                                          list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                                          placeholder="Href (ex: /about)"
                                          value={item.href}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      href: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            items: nextItems,
                                                      },
                                                });
                                          }}
                                          className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <input
                                          type="text"
                                          placeholder="Description (optional)"
                                          value={item.description}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      description: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            items: nextItems,
                                                      },
                                                });
                                          }}
                                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <div className="mt-2 text-right">
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextItems = block.data.items.filter((_, itemIndex) => itemIndex !== index);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems.length > 0 ? nextItems : [{ label: '', href: '', description: '' }],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove link
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          items: [...block.data.items, { label: '', href: '', description: '' }],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline"
                  >
                        + Add link
                  </button>
            </div>
      );
}

function ImageCarouselFields({
      block,
      onChange,
}: {
      block: CmsImageCarouselBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Carousel title"
                        value={block.data.title}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          title: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input
                                    type="checkbox"
                                    checked={block.data.autoplay}
                                    onChange={(event) =>
                                          onChange({
                                                ...block,
                                                data: {
                                                      ...block.data,
                                                      autoplay: event.target.checked,
                                                },
                                          })
                                    }
                              />
                              Autoplay
                        </label>

                        <input
                              type="number"
                              min={1000}
                              max={30000}
                              step={500}
                              value={block.data.intervalMs}
                              onChange={(event) =>
                                    onChange({
                                          ...block,
                                          data: {
                                                ...block.data,
                                                intervalMs: Number(event.target.value) || 5000,
                                          },
                                    })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2"
                              placeholder="Interval (ms)"
                        />
                  </div>

                  <div className="space-y-3">
                        {block.data.items.map((item, index) => (
                              <div key={`${block.id}-carousel-${index}`} className="rounded-lg border border-gray-200 p-3">
                                    <input
                                          type="text"
                                          placeholder="Image URL"
                                          value={item.imageUrl}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      imageUrl: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            items: nextItems,
                                                      },
                                                });
                                          }}
                                          className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <div className="grid gap-2 md:grid-cols-2">
                                          <input
                                                type="text"
                                                placeholder="Image alt"
                                                value={item.imageAlt}
                                                onChange={(event) => {
                                                      const nextItems = [...block.data.items];
                                                      nextItems[index] = {
                                                            ...nextItems[index],
                                                            imageAlt: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                placeholder="Caption"
                                                value={item.caption}
                                                onChange={(event) => {
                                                      const nextItems = [...block.data.items];
                                                      nextItems[index] = {
                                                            ...nextItems[index],
                                                            caption: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <input
                                          type="text"
                                          list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                                          placeholder="Slide link (optional)"
                                          value={item.href}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      href: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            items: nextItems,
                                                      },
                                                });
                                          }}
                                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <div className="mt-2 text-right">
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextItems = block.data.items.filter((_, itemIndex) => itemIndex !== index);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems.length > 0
                                                                        ? nextItems
                                                                        : [{ imageUrl: '', imageAlt: '', caption: '', href: '' }],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove slide
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          items: [...block.data.items, { imageUrl: '', imageAlt: '', caption: '', href: '' }],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline"
                  >
                        + Add slide
                  </button>
            </div>
      );
}

function TestimonialsFields({
      block,
      onChange,
}: {
      block: CmsTestimonialsBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Section title"
                        value={block.data.title}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          title: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <textarea
                        rows={3}
                        placeholder="Intro"
                        value={block.data.intro}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          intro: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <select
                        value={block.data.layout}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          layout: event.target.value as 'grid' | 'stack',
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                        <option value="grid">Grid</option>
                        <option value="stack">Stack</option>
                  </select>

                  <div className="space-y-3">
                        {block.data.items.map((item, index) => (
                              <div key={`${block.id}-testimonial-${index}`} className="rounded-lg border border-gray-200 p-3">
                                    <textarea
                                          rows={3}
                                          placeholder="Quote"
                                          value={item.quote}
                                          onChange={(event) => {
                                                const nextItems = [...block.data.items];
                                                nextItems[index] = {
                                                      ...nextItems[index],
                                                      quote: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            items: nextItems,
                                                      },
                                                });
                                          }}
                                          className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <div className="grid gap-2 md:grid-cols-2">
                                          <input
                                                type="text"
                                                placeholder="Name"
                                                value={item.name}
                                                onChange={(event) => {
                                                      const nextItems = [...block.data.items];
                                                      nextItems[index] = {
                                                            ...nextItems[index],
                                                            name: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                placeholder="Role / title"
                                                value={item.role}
                                                onChange={(event) => {
                                                      const nextItems = [...block.data.items];
                                                      nextItems[index] = {
                                                            ...nextItems[index],
                                                            role: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                                          <input
                                                type="text"
                                                placeholder="Image URL (optional)"
                                                value={item.imageUrl}
                                                onChange={(event) => {
                                                      const nextItems = [...block.data.items];
                                                      nextItems[index] = {
                                                            ...nextItems[index],
                                                            imageUrl: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                placeholder="Image alt text"
                                                value={item.imageAlt}
                                                onChange={(event) => {
                                                      const nextItems = [...block.data.items];
                                                      nextItems[index] = {
                                                            ...nextItems[index],
                                                            imageAlt: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items: nextItems,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <div className="mt-2 text-right">
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextItems = block.data.items.filter((_, itemIndex) => itemIndex !== index);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  items:
                                                                        nextItems.length > 0
                                                                              ? nextItems
                                                                              : [{ quote: '', name: '', role: '', imageUrl: '', imageAlt: '' }],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove testimonial
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          items: [...block.data.items, { quote: '', name: '', role: '', imageUrl: '', imageAlt: '' }],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline"
                  >
                        + Add testimonial
                  </button>
            </div>
      );
}

function PricingCardsFields({
      block,
      onChange,
}: {
      block: CmsPricingCardsBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Section title"
                        value={block.data.title}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          title: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <textarea
                        rows={3}
                        placeholder="Intro"
                        value={block.data.intro}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          intro: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <div className="space-y-3">
                        {block.data.cards.map((card, cardIndex) => (
                              <div key={`${block.id}-pricing-${cardIndex}`} className="rounded-lg border border-gray-200 p-3">
                                    <div className="grid gap-2 md:grid-cols-3">
                                          <input
                                                type="text"
                                                placeholder="Plan name"
                                                value={card.name}
                                                onChange={(event) => {
                                                      const nextCards = [...block.data.cards];
                                                      nextCards[cardIndex] = {
                                                            ...nextCards[cardIndex],
                                                            name: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  cards: nextCards,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                placeholder="Price"
                                                value={card.price}
                                                onChange={(event) => {
                                                      const nextCards = [...block.data.cards];
                                                      nextCards[cardIndex] = {
                                                            ...nextCards[cardIndex],
                                                            price: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  cards: nextCards,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                placeholder="Interval (optional)"
                                                value={card.interval}
                                                onChange={(event) => {
                                                      const nextCards = [...block.data.cards];
                                                      nextCards[cardIndex] = {
                                                            ...nextCards[cardIndex],
                                                            interval: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  cards: nextCards,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <textarea
                                          rows={2}
                                          placeholder="Description"
                                          value={card.description}
                                          onChange={(event) => {
                                                const nextCards = [...block.data.cards];
                                                nextCards[cardIndex] = {
                                                      ...nextCards[cardIndex],
                                                      description: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            cards: nextCards,
                                                      },
                                                });
                                          }}
                                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <div className="mt-2 space-y-2">
                                          {card.features.map((feature, featureIndex) => (
                                                <div key={`${block.id}-pricing-${cardIndex}-feature-${featureIndex}`} className="flex gap-2">
                                                      <input
                                                            type="text"
                                                            placeholder="Feature"
                                                            value={feature}
                                                            onChange={(event) => {
                                                                  const nextCards = [...block.data.cards];
                                                                  const nextFeatures = [...nextCards[cardIndex].features];
                                                                  nextFeatures[featureIndex] = event.target.value;
                                                                  nextCards[cardIndex] = {
                                                                        ...nextCards[cardIndex],
                                                                        features: nextFeatures,
                                                                  };
                                                                  onChange({
                                                                        ...block,
                                                                        data: {
                                                                              ...block.data,
                                                                              cards: nextCards,
                                                                        },
                                                                  });
                                                            }}
                                                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                      />
                                                      <button
                                                            type="button"
                                                            onClick={() => {
                                                                  const nextCards = [...block.data.cards];
                                                                  const nextFeatures = nextCards[cardIndex].features.filter((_, index) => index !== featureIndex);
                                                                  nextCards[cardIndex] = {
                                                                        ...nextCards[cardIndex],
                                                                        features: nextFeatures.length > 0 ? nextFeatures : [''],
                                                                  };
                                                                  onChange({
                                                                        ...block,
                                                                        data: {
                                                                              ...block.data,
                                                                              cards: nextCards,
                                                                        },
                                                                  });
                                                            }}
                                                            className="rounded-lg border border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50"
                                                      >
                                                            Remove
                                                      </button>
                                                </div>
                                          ))}
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextCards = [...block.data.cards];
                                                      nextCards[cardIndex] = {
                                                            ...nextCards[cardIndex],
                                                            features: [...nextCards[cardIndex].features, ''],
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  cards: nextCards,
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-primary-600 hover:underline"
                                          >
                                                + Add feature
                                          </button>
                                    </div>

                                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                                          <input
                                                type="text"
                                                placeholder="CTA label"
                                                value={card.ctaLabel}
                                                onChange={(event) => {
                                                      const nextCards = [...block.data.cards];
                                                      nextCards[cardIndex] = {
                                                            ...nextCards[cardIndex],
                                                            ctaLabel: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  cards: nextCards,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                                                placeholder="CTA href"
                                                value={card.ctaHref}
                                                onChange={(event) => {
                                                      const nextCards = [...block.data.cards];
                                                      nextCards[cardIndex] = {
                                                            ...nextCards[cardIndex],
                                                            ctaHref: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  cards: nextCards,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <div className="mt-2 flex items-center justify-between">
                                          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                                <input
                                                      type="checkbox"
                                                      checked={card.featured}
                                                      onChange={(event) => {
                                                            const nextCards = [...block.data.cards];
                                                            nextCards[cardIndex] = {
                                                                  ...nextCards[cardIndex],
                                                                  featured: event.target.checked,
                                                            };
                                                            onChange({
                                                                  ...block,
                                                                  data: {
                                                                        ...block.data,
                                                                        cards: nextCards,
                                                                  },
                                                            });
                                                      }}
                                                />
                                                Featured plan
                                          </label>
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextCards = block.data.cards.filter((_, index) => index !== cardIndex);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  cards:
                                                                        nextCards.length > 0
                                                                              ? nextCards
                                                                              : [
                                                                                      {
                                                                                            name: 'Starter',
                                                                                            price: '$99',
                                                                                            interval: '/month',
                                                                                            description: '',
                                                                                            features: [''],
                                                                                            ctaLabel: 'Get started',
                                                                                            ctaHref: '/contact',
                                                                                            featured: false,
                                                                                      },
                                                                                ],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove card
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          cards: [
                                                ...block.data.cards,
                                                {
                                                      name: '',
                                                      price: '',
                                                      interval: '',
                                                      description: '',
                                                      features: [''],
                                                      ctaLabel: '',
                                                      ctaHref: '/contact',
                                                      featured: false,
                                                },
                                          ],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline"
                  >
                        + Add pricing card
                  </button>
            </div>
      );
}

function VideoEmbedFields({
      block,
      onChange,
}: {
      block: CmsVideoEmbedBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Section title"
                        value={block.data.title}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          title: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <input
                        type="text"
                        placeholder="Embed URL (YouTube/Vimeo/etc)"
                        value={block.data.embedUrl}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          embedUrl: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <textarea
                        rows={2}
                        placeholder="Caption"
                        value={block.data.caption}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          caption: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <select
                        value={block.data.aspectRatio}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          aspectRatio: event.target.value as '16:9' | '4:3' | '1:1',
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                        <option value="16:9">16:9</option>
                        <option value="4:3">4:3</option>
                        <option value="1:1">1:1</option>
                  </select>
            </div>
      );
}

function TeamGridFields({
      block,
      onChange,
}: {
      block: CmsTeamGridBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      return (
            <div className="space-y-4">
                  <input
                        type="text"
                        placeholder="Section title"
                        value={block.data.title}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          title: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <textarea
                        rows={3}
                        placeholder="Intro"
                        value={block.data.intro}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          intro: event.target.value,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <select
                        value={block.data.columns}
                        onChange={(event) =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          columns: Number(event.target.value) as 2 | 3 | 4,
                                    },
                              })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                        <option value={2}>2 columns</option>
                        <option value={3}>3 columns</option>
                        <option value={4}>4 columns</option>
                  </select>

                  <div className="space-y-3">
                        {block.data.members.map((member, index) => (
                              <div key={`${block.id}-member-${index}`} className="rounded-lg border border-gray-200 p-3">
                                    <div className="grid gap-2 md:grid-cols-2">
                                          <input
                                                type="text"
                                                placeholder="Name"
                                                value={member.name}
                                                onChange={(event) => {
                                                      const nextMembers = [...block.data.members];
                                                      nextMembers[index] = {
                                                            ...nextMembers[index],
                                                            name: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  members: nextMembers,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                placeholder="Role"
                                                value={member.role}
                                                onChange={(event) => {
                                                      const nextMembers = [...block.data.members];
                                                      nextMembers[index] = {
                                                            ...nextMembers[index],
                                                            role: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  members: nextMembers,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <textarea
                                          rows={2}
                                          placeholder="Bio"
                                          value={member.bio}
                                          onChange={(event) => {
                                                const nextMembers = [...block.data.members];
                                                nextMembers[index] = {
                                                      ...nextMembers[index],
                                                      bio: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            members: nextMembers,
                                                      },
                                                });
                                          }}
                                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                                          <input
                                                type="text"
                                                placeholder="Image URL (optional)"
                                                value={member.imageUrl}
                                                onChange={(event) => {
                                                      const nextMembers = [...block.data.members];
                                                      nextMembers[index] = {
                                                            ...nextMembers[index],
                                                            imageUrl: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  members: nextMembers,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="text"
                                                placeholder="Image alt text"
                                                value={member.imageAlt}
                                                onChange={(event) => {
                                                      const nextMembers = [...block.data.members];
                                                      nextMembers[index] = {
                                                            ...nextMembers[index],
                                                            imageAlt: event.target.value,
                                                      };
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  members: nextMembers,
                                                            },
                                                      });
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <input
                                          type="text"
                                          list={CMS_LINK_SUGGESTIONS_DATALIST_ID}
                                          placeholder="Profile link (optional)"
                                          value={member.profileHref}
                                          onChange={(event) => {
                                                const nextMembers = [...block.data.members];
                                                nextMembers[index] = {
                                                      ...nextMembers[index],
                                                      profileHref: event.target.value,
                                                };
                                                onChange({
                                                      ...block,
                                                      data: {
                                                            ...block.data,
                                                            members: nextMembers,
                                                      },
                                                });
                                          }}
                                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    <div className="mt-2 text-right">
                                          <button
                                                type="button"
                                                onClick={() => {
                                                      const nextMembers = block.data.members.filter((_, memberIndex) => memberIndex !== index);
                                                      onChange({
                                                            ...block,
                                                            data: {
                                                                  ...block.data,
                                                                  members:
                                                                        nextMembers.length > 0
                                                                              ? nextMembers
                                                                              : [
                                                                                      {
                                                                                            name: '',
                                                                                            role: '',
                                                                                            bio: '',
                                                                                            imageUrl: '',
                                                                                            imageAlt: '',
                                                                                            profileHref: '',
                                                                                      },
                                                                                ],
                                                            },
                                                      });
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                          >
                                                Remove member
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <button
                        type="button"
                        onClick={() =>
                              onChange({
                                    ...block,
                                    data: {
                                          ...block.data,
                                          members: [
                                                ...block.data.members,
                                                { name: '', role: '', bio: '', imageUrl: '', imageAlt: '', profileHref: '' },
                                          ],
                                    },
                              })
                        }
                        className="text-sm font-medium text-primary-600 hover:underline"
                  >
                        + Add member
                  </button>
            </div>
      );
}

function BlockFields({
      block,
      onChange,
}: {
      block: CmsBlock;
      onChange: (nextBlock: CmsBlock) => void;
}) {
      switch (block.type) {
            case 'hero':
                  return <HeroFields block={block} onChange={onChange} />;
            case 'trust_bar':
                  return <TrustBarFields block={block} onChange={onChange} />;
            case 'process_steps':
                  return <ProcessStepsFields block={block} onChange={onChange} />;
            case 'insurance_strip':
                  return <InsuranceStripFields block={block} onChange={onChange} />;
            case 'rich_text':
                  return <RichTextFields block={block} onChange={onChange} />;
            case 'image_text':
                  return <ImageTextFields block={block} onChange={onChange} />;
            case 'faq':
                  return <FaqFields block={block} onChange={onChange} />;
            case 'cta_band':
                  return <CtaBandFields block={block} onChange={onChange} />;
            case 'cms_links':
                  return <CmsLinksFields block={block} onChange={onChange} />;
            case 'image_carousel':
                  return <ImageCarouselFields block={block} onChange={onChange} />;
            case 'testimonials':
                  return <TestimonialsFields block={block} onChange={onChange} />;
            case 'pricing_cards':
                  return <PricingCardsFields block={block} onChange={onChange} />;
            case 'video_embed':
                  return <VideoEmbedFields block={block} onChange={onChange} />;
            case 'team_grid':
                  return <TeamGridFields block={block} onChange={onChange} />;
            default:
                  return null;
      }
}

export default function CmsBlockEditor({
      blocks,
      onChange,
      cmsLinkSuggestions = [],
}: CmsBlockEditorProps) {
      const sensors = useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
                  coordinateGetter: sortableKeyboardCoordinates,
            })
      );

      const blockIds = blocks.map((block) => block.id);

      const handleDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) {
                  return;
            }

            const oldIndex = blocks.findIndex((block) => block.id === active.id);
            const newIndex = blocks.findIndex((block) => block.id === over.id);

            if (oldIndex < 0 || newIndex < 0) {
                  return;
            }

            onChange(arrayMove(blocks, oldIndex, newIndex));
      };

      const updateBlock = (blockId: string, nextBlock: CmsBlock) => {
            onChange(blocks.map((block) => (block.id === blockId ? nextBlock : block)));
      };

      const removeBlock = (blockId: string) => {
            onChange(blocks.filter((block) => block.id !== blockId));
      };

      const addBlock = (type: CmsBlockType) => {
            const newBlock = createDefaultBlock(type, crypto.randomUUID());
            onChange([...blocks, newBlock]);
      };

      return (
            <div className="space-y-6">
                  {cmsLinkSuggestions.length > 0 && (
                        <datalist id={CMS_LINK_SUGGESTIONS_DATALIST_ID}>
                              {cmsLinkSuggestions.map((item) => (
                                    <option key={`${item.href}-${item.label}`} value={item.href} label={item.label} />
                              ))}
                        </datalist>
                  )}

                  <div className="rounded-lg border border-dashed border-gray-300 p-4">
                        <p className="text-sm font-semibold text-gray-800 mb-3">Add block</p>
                        <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => addBlock('hero')} className="btn-secondary text-sm px-4 py-2">
                                    Hero
                              </button>
                              <button type="button" onClick={() => addBlock('trust_bar')} className="btn-secondary text-sm px-4 py-2">
                                    Trust Bar
                              </button>
                              <button type="button" onClick={() => addBlock('process_steps')} className="btn-secondary text-sm px-4 py-2">
                                    Process Steps
                              </button>
                              <button type="button" onClick={() => addBlock('insurance_strip')} className="btn-secondary text-sm px-4 py-2">
                                    Insurance Strip
                              </button>
                              <button type="button" onClick={() => addBlock('rich_text')} className="btn-secondary text-sm px-4 py-2">
                                    Rich Text
                              </button>
                              <button type="button" onClick={() => addBlock('image_text')} className="btn-secondary text-sm px-4 py-2">
                                    Image + Text
                              </button>
                              <button type="button" onClick={() => addBlock('faq')} className="btn-secondary text-sm px-4 py-2">
                                    FAQ
                              </button>
                              <button type="button" onClick={() => addBlock('cta_band')} className="btn-secondary text-sm px-4 py-2">
                                    CTA Band
                              </button>
                              <button type="button" onClick={() => addBlock('cms_links')} className="btn-secondary text-sm px-4 py-2">
                                    CMS Links
                              </button>
                              <button type="button" onClick={() => addBlock('image_carousel')} className="btn-secondary text-sm px-4 py-2">
                                    Image Carousel
                              </button>
                              <button type="button" onClick={() => addBlock('testimonials')} className="btn-secondary text-sm px-4 py-2">
                                    Testimonials
                              </button>
                              <button type="button" onClick={() => addBlock('pricing_cards')} className="btn-secondary text-sm px-4 py-2">
                                    Pricing Cards
                              </button>
                              <button type="button" onClick={() => addBlock('video_embed')} className="btn-secondary text-sm px-4 py-2">
                                    Video Embed
                              </button>
                              <button type="button" onClick={() => addBlock('team_grid')} className="btn-secondary text-sm px-4 py-2">
                                    Team Grid
                              </button>
                        </div>
                  </div>

                  {blocks.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
                              No blocks added yet. Start by adding a block above.
                        </div>
                  ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                              <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-4">
                                          {blocks.map((block) => (
                                                <SortableShell key={block.id} block={block}>
                                                      <BlockHeaderActions
                                                            block={block}
                                                            onChange={(nextBlock) => updateBlock(block.id, nextBlock)}
                                                            onRemove={() => removeBlock(block.id)}
                                                      />
                                                      <BlockFields
                                                            block={block}
                                                            onChange={(nextBlock) => updateBlock(block.id, nextBlock)}
                                                      />
                                                </SortableShell>
                                          ))}
                                    </div>
                              </SortableContext>
                        </DndContext>
                  )}
            </div>
      );
}
