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
      CmsRichTextBlock,
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
