import { SECTION_TYPES, SECTION_METADATA } from "../../utils/pageConstants";

/**
 * Creates a custom Editor.js tool for section placeholders
 * Shows helpful information about the section type being edited
 */
export class SectionPlaceholder {
  constructor({ data, api, config }) {
    this.data = data;
    this.api = api;
    this.config = config;
    this.wrapper = null;
  }

  static get toolbox() {
    return {
      title: "Section",
      icon: "📦",
    };
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("section-placeholder");

    const sectionType = this.data.type || SECTION_TYPES.CONTENT_BOX;
    const metadata = SECTION_METADATA[sectionType] || {};

    wrapper.innerHTML = `
      <div class="bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg p-6">
        <div class="flex items-start space-x-4">
          <div class="text-4xl">${metadata.icon || "📦"}</div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${metadata.label || "Content Section"}</h3>
              <select class="section-type-select text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                ${Object.entries(SECTION_METADATA)
                  .map(
                    ([key, meta]) => `
                  <option value="${key}" ${key === sectionType ? "selected" : ""}>
                    ${meta.icon} ${meta.label}
                  </option>
                `,
                  )
                  .join("")}
              </select>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${metadata.description || "Section content"}</p>
            <textarea 
              class="section-content-input w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              rows="6"
              placeholder="Enter section content as JSON...&#10;&#10;Example:&#10;{&#10;  &quot;title&quot;: &quot;Section Title&quot;,&#10;  &quot;content&quot;: &quot;Section content here&quot;&#10;}"
            >${this.data.content ? JSON.stringify(this.data.content, null, 2) : ""}</textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Tip: Use validation from @atomictemplate/validations to ensure correct structure
            </p>
          </div>
        </div>
      </div>
    `;

    this.wrapper = wrapper;

    // Handle section type change
    const typeSelect = wrapper.querySelector(".section-type-select");
    typeSelect.addEventListener("change", (e) => {
      this.data.type = e.target.value;
      // Re-render with new section type
      const parent = wrapper.parentNode;
      if (parent) {
        const newWrapper = this.render();
        parent.replaceChild(newWrapper, wrapper);
      }
    });

    // Handle content changes
    const contentInput = wrapper.querySelector(".section-content-input");
    contentInput.addEventListener("input", (e) => {
      try {
        this.data.content = JSON.parse(e.target.value);
      } catch (err) {
        // Keep as string if not valid JSON
        this.data.content = e.target.value;
      }
    });

    return wrapper;
  }

  save() {
    const contentInput = this.wrapper.querySelector(".section-content-input");
    let content;

    try {
      content = JSON.parse(contentInput.value);
    } catch (err) {
      content = contentInput.value;
    }

    return {
      type: this.data.type || SECTION_TYPES.CONTENT_BOX,
      content: content,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }
}

/**
 * Get all available section types for dropdown
 */
export function getAvailableSectionTypes() {
  return Object.entries(SECTION_METADATA).map(([key, metadata]) => ({
    value: key,
    label: metadata.label,
    description: metadata.description,
    icon: metadata.icon,
  }));
}

/**
 * Validate section content using appropriate schema
 */
export async function validateSectionContent(sectionType, content) {
  try {
    // Import validation schemas based on section type

    // Map section types to validation schemas
    const schemaMap = {
      [SECTION_TYPES.BANNER]: async () => {
        const { BannerSchema } =
          await import("@atomictemplate/validations/common");
        return BannerSchema;
      },
      [SECTION_TYPES.FAQ]: async () => {
        const { FAQSchema } =
          await import("@atomictemplate/validations/common");
        return FAQSchema;
      },
      [SECTION_TYPES.GALLERY]: async () => {
        const { GallerySchema } =
          await import("@atomictemplate/validations/common");
        return GallerySchema;
      },
      [SECTION_TYPES.CTA]: async () => {
        const { CtaSchema } =
          await import("@atomictemplate/validations/common");
        return CtaSchema;
      },
      // Add more mappings as needed
    };

    if (schemaMap[sectionType]) {
      const schema = await schemaMap[sectionType]();
      const result = schema.safeParse(content);
      return {
        valid: result.success,
        errors: result.success ? [] : result.error.errors,
        data: result.success ? result.data : null,
      };
    }

    // No specific schema, return as valid
    return {
      valid: true,
      errors: [],
      data: content,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error.message }],
      data: null,
    };
  }
}
