/*
 * GBSBFORYOU Universal Template Engine
 * Ekaant AI Typing
 *
 * File: app.js
 * Version: 0.2.0
 *
 * Flow:
 * Raw Text
 * → Field Extraction
 * → Template Selection
 * → Template Mapping
 * → Validation
 * → Preview
 * → JSON
 */

(function () {
  "use strict";

  /* =========================================
     APPLICATION STATE
  ========================================= */

  const state = {
    rawText: "",
    fields: {},
    mapping: [],
    mappedData: {},
    templateId: "application-basic-001",
    validation: null,
    confirmed: false
  };


  /* =========================================
     FIELD DICTIONARY
  ========================================= */

  const FIELD_DICTIONARY = {
    "नाम": "name",
    "name": "name",

    "पिता का नाम": "father_name",
    "father name": "father_name",

    "माता का नाम": "mother_name",
    "mother name": "mother_name",

    "पता": "address",
    "address": "address",

    "शहर": "city",
    "city": "city",

    "जिला": "district",
    "district": "district",

    "राज्य": "state",
    "state": "state",

    "देश": "country",
    "country": "country",

    "पिन": "pin_code",
    "पिन कोड": "pin_code",
    "pin code": "pin_code",

    "मोबाइल": "phone",
    "मोबाइल नंबर": "phone",
    "phone": "phone",

    "ईमेल": "email",
    "email": "email",

    "दिनांक": "date",
    "तारीख": "date",
    "date": "date",

    "विषय": "subject",
    "subject": "subject",

    "संदर्भ संख्या": "reference_number",
    "reference number": "reference_number",

    "संस्था": "organization",
    "organization": "organization",

    "पद": "designation",
    "designation": "designation",

    "राशि": "amount",
    "amount": "amount",

    "दस्तावेज संख्या": "document_number",
    "दस्तावेज़ संख्या": "document_number",
    "document number": "document_number"
  };


  /* =========================================
     FIELD LABELS
  ========================================= */

  const FIELD_LABELS = {
    name: "नाम",
    father_name: "पिता का नाम",
    mother_name: "माता का नाम",
    address: "पता",
    city: "शहर",
    district: "जिला",
    state: "राज्य",
    country: "देश",
    pin_code: "पिन कोड",
    phone: "मोबाइल",
    email: "ईमेल",
    date: "दिनांक",
    subject: "विषय",
    reference_number: "संदर्भ संख्या",
    organization: "संस्था",
    designation: "पद",
    amount: "राशि",
    document_number: "दस्तावेज़ संख्या"
  };


  /* =========================================
     DOM HELPER
  ========================================= */

  function $(id) {
    return document.getElementById(id);
  }


  /* =========================================
     STATUS MESSAGE
  ========================================= */

  function showStatus(message, type) {
    const box = $("statusBox");

    if (!box) {
      return;
    }

    box.className = "status " + type;
    box.textContent = message;
  }


  /* =========================================
     FIELD EXTRACTION
  ========================================= */

  function extractFields(text) {
    const fields = {};

    const lines = text.split(/\r?\n/);

    lines.forEach(function (line) {
      const separator = line.indexOf(":");

      if (separator === -1) {
        return;
      }

      const rawKey = line
        .substring(0, separator)
        .trim()
        .toLowerCase();

      const value = line
        .substring(separator + 1)
        .trim();

      if (!value) {
        return;
      }

      const field = FIELD_DICTIONARY[rawKey];

      if (!field) {
        return;
      }

      fields[field] = {
        value: value,
        source: "USER_PROVIDED",
        confidence: 1,
        confirmed: false
      };
    });

    return fields;
  }


  /* =========================================
     RENDER FIELDS
  ========================================= */

  function renderFields() {
    const container = $("fieldsContainer");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    const keys = Object.keys(state.fields);

    if (!keys.length) {
      container.innerHTML =
        "<p>कोई recognized field नहीं मिली।</p>";
      return;
    }

    keys.forEach(function (key) {
      const item = state.fields[key];

      const wrapper = document.createElement("div");
      wrapper.className = "field";

      const label = document.createElement("div");
      label.className = "field-name";
      label.textContent = FIELD_LABELS[key] || key;

      const input = document.createElement("input");
      input.type = "text";
      input.value = item.value || "";

      input.addEventListener("input", function (event) {
        state.fields[key].value =
          event.target.value;

        state.fields[key].confirmed = false;
        state.confirmed = false;

        updateJSON();
      });

      const source = document.createElement("div");
      source.className = "field-source";

      source.textContent =
        "Source: " +
        item.source +
        " · Confidence: " +
        Math.round(item.confidence * 100) +
        "%";

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      wrapper.appendChild(source);

      container.appendChild(wrapper);
    });
  }


  /* =========================================
     GET TEMPLATE
  ========================================= */

  function getTemplate() {
    if (!window.UniversalTemplateEngine) {
      return null;
    }

    return window.UniversalTemplateEngine
      .getTemplate(state.templateId);
  }


  /* =========================================
     UPDATE TEMPLATE INFORMATION
  ========================================= */

  function updateTemplateInfo() {
    const template = getTemplate();
    const box = $("templateInfo");

    if (!box) {
      return;
    }

    if (!template) {
      box.textContent =
        "Template उपलब्ध नहीं है।";
      return;
    }

    box.innerHTML =
      "<strong>Template:</strong> " +
      escapeHTML(template.name) +
      "<br>" +
      "<strong>Version:</strong> " +
      escapeHTML(template.version || "1.0") +
      "<br>" +
      "<strong>Status:</strong> " +
      escapeHTML(template.status || "ACTIVE");
  }


  /* =========================================
     HTML ESCAPE
  ========================================= */

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================
     TEMPLATE CHANGE
  ========================================= */

  function handleTemplateChange(event) {
    const selected = event.target.value;

    if (selected === "application") {
      state.templateId =
        "application-basic-001";
    } else if (selected === "letter") {
      state.templateId =
        "letter-basic-001";
    } else {
      state.templateId = selected;
    }

    state.mapping = [];
    state.mappedData = {};
    state.validation = null;
    state.confirmed = false;

    clearMapping();
    clearPreview();
    updateTemplateInfo();
    updateJSON();
  }


  /* =========================================
     CLEAR MAPPING
  ========================================= */

  function clearMapping() {
    const container = $("mappingContainer");

    if (!container) {
      return;
    }

    container.innerHTML =
      "<p>Mapping अभी नहीं हुई है।</p>";
  }


  /* =========================================
     CLEAR PREVIEW
  ========================================= */

  function clearPreview() {
    const preview = $("previewBox");

    if (!preview) {
      return;
    }

    preview.textContent =
      "Preview यहाँ दिखाई देगा।";
  }


  /* =========================================
     CREATE MAPPING
  ========================================= */

  function createMapping() {
    const template = getTemplate();

    if (!template) {
      showStatus(
        "Template उपलब्ध नहीं है।",
        "error"
      );
      return;
    }

    if (!Object.keys(state.fields).length) {
      showStatus(
        "पहले Raw Text से fields निकालें।",
        "warning"
      );
      return;
    }

    try {
      state.mapping =
        window.UniversalTemplateEngine
          .mapFields(
            state.fields,
            state.templateId
          );

      state.mappedData =
        window.UniversalTemplateEngine
          .applyMapping(
            state.mapping
          );

      renderMapping();
      updateJSON();

      showStatus(
        "Template mapping तैयार है। कृपया mapping की जाँच करें।",
        "success"
      );

    } catch (error) {
      console.error(
        "Mapping error:",
        error
      );

      showStatus(
        "Template mapping में समस्या हुई।",
        "error"
      );
    }
  }


  /* =========================================
     RENDER MAPPING
  ========================================= */

  function renderMapping() {
    const container =
      $("mappingContainer");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    if (!state.mapping.length) {
      container.innerHTML =
        "<p>कोई mapping उपलब्ध नहीं है।</p>";
      return;
    }

    state.mapping.forEach(
      function (item, index) {
        const wrapper =
          document.createElement("div");

        wrapper.className = "field";

        const title =
          document.createElement("div");

        title.className = "field-name";

        title.textContent =
          item.template_label ||
          item.template_field;

        const input =
          document.createElement("input");

        input.type = "text";
        input.value = item.value || "";

        input.addEventListener(
          "input",
          function (event) {
            state.mapping[index].value =
              event.target.value;

            state.mapping[index].method =
              "MANUAL";

            state.mapping[index].confirmed =
              true;

            state.mappedData =
              window.UniversalTemplateEngine
                .applyMapping(
                  state.mapping
                );

            state.confirmed = false;

            updateJSON();
          }
        );

        const details =
          document.createElement("div");

        details.className =
          "field-source";

        details.textContent =
          "Source: " +
          (
            item.source_field ||
            "MISSING"
          ) +
          " · Method: " +
          (
            item.method ||
            "MISSING"
          ) +
          " · Confidence: " +
          Math.round(
            Number(item.confidence || 0) * 100
          ) +
          "%";

        wrapper.appendChild(title);
        wrapper.appendChild(input);
        wrapper.appendChild(details);

        container.appendChild(wrapper);
      }
    );
  }


  /* =========================================
     VALIDATE DOCUMENT
  ========================================= */

  function validateDocument() {
    const template = getTemplate();

    if (!template) {
      showStatus(
        "Template उपलब्ध नहीं है।",
        "error"
      );
      return false;
    }

    if (!state.mapping.length) {
      showStatus(
        "पहले Template Mapping करें।",
        "warning"
      );
      return false;
    }

    state.mappedData =
      window.UniversalTemplateEngine
        .applyMapping(
          state.mapping
        );

    const result =
      window.UniversalTemplateValidator
        .canGenerate(
          template,
          state.mappedData
        );

    state.validation = result;

    updateJSON();

    if (!result.allowed) {
      const messages = [];

      if (
        result.validation &&
        Array.isArray(result.validation.errors)
      ) {
        result.validation.errors.forEach(
          function (error) {
            messages.push(
              error.message
            );
          }
        );
      }

      if (
        result.fabrication &&
        Array.isArray(result.fabrication.warnings)
      ) {
        result.fabrication.warnings.forEach(
          function (warning) {
            messages.push(
              warning.message
            );
          }
        );
      }

      showStatus(
        messages.length
          ? messages.join(" ")
          : "Validation failed.",
        "error"
      );

      renderPreview(false);

      return false;
    }

    state.confirmed = true;

    renderPreview(true);

    showStatus(
      "Validation सफल। Document Preview तैयार है।",
      "success"
    );

    return true;
  }


  /* =========================================
     DOCUMENT PREVIEW
  ========================================= */

  function renderPreview(valid) {
    const preview = $("previewBox");

    if (!preview) {
      return;
    }

    if (!valid) {
      preview.textContent =
        "Document तैयार नहीं किया जा सकता। पहले missing या invalid information ठीक करें।";
      return;
    }

    try {
      const documentText =
        window.UniversalTemplateEngine
          .render(
            state.templateId,
            state.mappedData
          );

      preview.textContent =
        documentText;

    } catch (error) {
      console.error(
        "Preview error:",
        error
      );

      preview.textContent =
        "Preview generation में समस्या हुई।";
    }
  }


  /* =========================================
     UPDATE JSON
  ========================================= */

  function updateJSON() {
    const output = $("jsonOutput");

    if (!output) {
      return;
    }

    const data = {
      project:
        "GBSBFORYOU Universal Template Engine",

      version:
        "0.2.0",

      module:
        "Ekaant AI Typing",

      template_id:
        state.templateId,

      raw_input:
        state.rawText,

      fields:
        state.fields,

      mapping:
        state.mapping,

      mapped_data:
        state.mappedData,

      confirmed:
        state.confirmed,

      validation:
        state.validation
    };

    output.value =
      JSON.stringify(
        data,
        null,
        2
      );
  }


  /* =========================================
     COPY JSON
  ========================================= */

  async function copyJSON() {
    const output =
      $("jsonOutput");

    if (!output) {
      return;
    }

    const text =
      output.value;

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        text
      );

      showStatus(
        "JSON clipboard में copy हो गया।",
        "success"
      );

    } catch (error) {
      output.focus();
      output.select();

      showStatus(
        "JSON select हो गया है। अब Copy करें।",
        "warning"
      );
    }
  }


  /* =========================================
     RAW TEXT HANDLER
  ========================================= */

  function handleExtract() {
    const input = $("rawText");

    if (!input) {
      return;
    }

    const raw =
      input.value.trim();

    if (!raw) {
      showStatus(
        "पहले कच्चा टेक्स्ट डालें।",
        "warning"
      );
      return;
    }

    state.rawText = raw;

    state.fields =
      extractFields(raw);

    state.mapping = [];
    state.mappedData = {};
    state.validation = null;
    state.confirmed = false;

    renderFields();
    clearMapping();
    clearPreview();
    updateJSON();

    const count =
      Object.keys(
        state.fields
      ).length;

    if (!count) {
      showStatus(
        "कोई recognized field नहीं मिली। उदाहरण: नाम: अजय सिंह चौहान",
        "warning"
      );
      return;
    }

    showStatus(
      count +
      " field निकाली गई। अब Template Mapping करें।",
      "success"
    );
  }


  /* =========================================
     MODULE CHECK
  ========================================= */

  function checkModules() {
    const engine =
      window.UniversalTemplateEngine;

    const validator =
      window.UniversalTemplateValidator;

    if (!engine) {
      showStatus(
        "template-engine.js load नहीं हुआ।",
        "error"
      );
      return false;
    }

    if (!validator) {
      showStatus(
        "validator.js load नहीं हुआ।",
        "error"
      );
      return false;
    }

    return true;
  }


  /* =========================================
     INITIALIZE
  ========================================= */

  function init() {
    if (!checkModules()) {
      return;
    }

    const extractBtn =
      $("extractBtn");

    if (extractBtn) {
      extractBtn.addEventListener(
        "click",
        handleExtract
      );
    }

    const templateSelect =
      $("templateSelect");

    if (templateSelect) {
      templateSelect.addEventListener(
        "change",
        handleTemplateChange
      );
    }

    const mapBtn =
      $("mapBtn");

    if (mapBtn) {
      mapBtn.addEventListener(
        "click",
        createMapping
      );
    }

    const validateBtn =
      $("validateBtn");

    if (validateBtn) {
      validateBtn.addEventListener(
        "click",
        validateDocument
      );
    }

    const copyJsonBtn =
      $("copyJsonBtn");

    if (copyJsonBtn) {
      copyJsonBtn.addEventListener(
        "click",
        copyJSON
      );
    }

    updateTemplateInfo();
    clearMapping();
    updateJSON();
  }


  /* =========================================
     START APPLICATION
  ========================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }


  /* =========================================
     PUBLIC API
  ========================================= */

  window.EkaantUniversalApp = {

    getState: function () {
      return state;
    },

    extract: handleExtract,

    map: createMapping,

    validate: validateDocument,

    preview: renderPreview

  };

})();
