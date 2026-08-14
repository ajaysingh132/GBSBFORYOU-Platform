/*
 * Universal Template Engine — Integrated MVP
 * GBSBFORYOU / Ekaant AI Typing
 *
 * File: app.js
 * Version: 0.2.0
 *
 * Flow:
 * Raw Text
 *   ↓
 * Field Extraction
 *   ↓
 * Template Selection
 *   ↓
 * Template Mapping
 *   ↓
 * Validation
 *   ↓
 * Preview
 *   ↓
 * JSON
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
     STATUS
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
     EXTRACT RAW TEXT
  ========================================= */

  function extractFields(text) {

    const fields = {};

    const lines =
      text.split(/\r?\n/);


    lines.forEach(function (line) {

      const separator =
        line.indexOf(":");


      if (separator === -1) {
        return;
      }


      const rawKey =
        line
          .substring(0, separator)
          .trim()
          .toLowerCase();


      const value =
        line
          .substring(separator + 1)
          .trim();


      if (!value) {
        return;
      }


      const field =
        FIELD_DICTIONARY[rawKey];


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
     RENDER STRUCTURED FIELDS
  ========================================= */

  function renderFields() {

    const container =
      $("fieldsContainer");


    if (!container) {
      return;
    }


    container.innerHTML = "";


    const keys =
      Object.keys(state.fields);


    if (!keys.length) {

      container.innerHTML =
        "<p>कोई recognized field नहीं मिली।</p>";

      return;

    }


    keys.forEach(function (key) {

      const item =
        state.fields[key];


      const wrapper =
        document.createElement("div");

      wrapper.className =
        "field";


      const label =
        document.createElement("div");

      label.className =
        "field-name";

      label.textContent =
        FIELD_LABELS[key] || key;


      const input =
        document.createElement("input");

      input.type =
        "text";

      input.value =
        item.value;


      input.addEventListener(
        "input",
        function (event) {

          state.fields[key].value =
            event.target.value;

          state.fields[key].confirmed =
            false;

          state.confirmed =
            false;

          updateJSON();

        }
      );


      const source =
        document.createElement("div");

      source.className =
        "field-source";


      source.textContent =
        "Source: " +
        item.source +
        " · Confidence: " +
        Math.round(
          item.confidence * 100
        ) +
        "%";


      wrapper.appendChild(label);

      wrapper.appendChild(input);

      wrapper.appendChild(source);

      container.appendChild(wrapper);

    });

  }


  /* =========================================
     GET SELECTED TEMPLATE
  ========================================= */

  function getTemplate() {

    if (
      !window.UniversalTemplateEngine
    ) {

      return null;

    }


    return window.UniversalTemplateEngine
      .getTemplate(
        state.templateId
      );

  }


  /* =========================================
     UPDATE TEMPLATE INFORMATION
  ========================================= */

  function updateTemplateInfo() {

    const template =
      getTemplate();


    const box =
      $("templateInfo");


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
      template.name +
      "<br>" +
      "<strong>Version:</strong> " +
      template.version +
      "<br>" +
      "<strong>Status:</strong> " +
      template.status;

  }


  /* =========================================
     TEMPLATE SELECT CHANGE
  ========================================= */

  function handleTemplateChange(event) {

    const selected =
      event.target.value;


    if (
      selected === "application"
    ) {

      state.templateId =
        "application-basic-001";

    } else if (
      selected === "letter"
    ) {

      state.templateId =
        "letter-basic-001";

    } else {

      state.templateId =
        selected;

    }


    state.mapping = [];

    state.mappedData = {};

    state.validation = null;

    state.confirmed = false;


    clearMapping();

    updateTemplateInfo();

    updateJSON();

  }


  /* =========================================
     CLEAR MAPPING
  ========================================= */

  function clearMapping() {

    const container =
      $("mappingContainer");


    if (!container) {
      return;
    }


    container.innerHTML =
      "<p>Mapping अभी नहीं हुई है।</p>";

  }


  /* =========================================
     CREATE TEMPLATE MAPPING
  ========================================= */

  function createMapping() {

    const template =
      getTemplate();


    if (!template) {

      showStatus(
        "Template उपलब्ध नहीं है।",
        "error"
      );

      return;

    }


    if (
      !Object.keys(state.fields).length
    ) {

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

      console.error(error);

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


        wrapper.className =
          "field";


        const title =
          document.createElement("div");


        title.className =
          "field-name";


        title.textContent =
          item.template_label;


        const details =
          document.createElement("div");


        details.className =
          "field-source";


        const source =
          item.source_field
            ? item.source_field
            : "MISSING";


        details.textContent =
          "Source: " +
          source +
          " · Method: " +
          item.method +
          " · Confidence: " +
          Math.round(
            item.confidence * 100
          ) +
          "%";


        const input =
          document.createElement("input");


        input.type =
          "text";


        input.value =
          item.value || "";


        input.addEventListener(
          "input",
          function (event) {

            state.mapping[index].value =
              event.target.value;

            state.mapping[index].method =
              "MANUAL";

            state.mapping[index].confirmed =
              false;


            state.mappedData =
              window.UniversalTemplateEngine
                .applyMapping(
                  state.mapping
                );


            state.confirmed =
              false;


            updateJSON();

          }
        );


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

    const template =
      getTemplate();


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


    /*
     * Validator expects:
     *
     * {
     *   field: {
     *     value: "..."
     *   }
     * }
     */

    const result =
      window.UniversalTemplateValidator
        .canGenerate(
          template,
          state.mappedData
        );


    state.validation =
      result;


    updateJSON();


    if (!result.allowed) {

      const messages = [];


      if (
        result.validation &&
        result.validation.errors
      ) {

        result.validation.errors
          .forEach(
            function (error) {

              messages.push(
                error.message
              );

            }
          );

      }


      if (
        result.fabrication &&
        result.fabrication.warnings
      ) {

        result.fabrication.warnings
          .forEach(
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


      renderValidationPreview(
        false
      );


      return false;

    }


    state.confirmed =
      true;


    renderValidationPreview(
      true
    );


    showStatus(
      "Validation सफल। Document Preview तैयार है।",
      "success"
    );


    return true;

  }


  /* =========================================
     PREVIEW
  ========================================= */

  function renderValidationPreview(
    valid
  ) {

    const preview =
      $("previewBox");


    if (!preview) {
      return;
    }


    if (!valid) {

      preview.textContent =
        "Document तैयार नहीं किया जा सकता। पहले missing/invalid information ठीक करें।";

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

      console.error(error);

      preview.textContent =
        "Preview generation में समस्या हुई।";

    }

  }


  /* =========================================
     UPDATE JSON
  ========================================= */

  function updateJSON() {

    const output =
      $("jsonOutput");


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

      await navigator
        .clipboard
        .writeText(text);


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
     EXTRACT RAW TEXT
  ========================================= */

  function handleExtract() {

    const input =
      $("rawText");


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


    state.rawText =
      raw;


    state.fields =
      extractFields(raw);


    state.mapping =
      [];

    state.mappedData =
      {};

    state.validation =
      null;

    state.confirmed =
      false;


    renderFields();

    clearMapping();

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
     INITIALIZE
  ========================================= */

  function init() {

    /*
     * Check required modules.
     */

    if (
      !window.UniversalTemplateEngine
    ) {

      console.error(
        "template-engine.js नहीं मिला।"
      );

      showStatus(
        "Template Engine module load नहीं हुआ।",
        "error"
      );

      return;

    }


    if (
      !window.UniversalTemplateValidator
    ) {

      console.error(
        "validator.js नहीं मिला।"
      );

      showStatus(
        "Validator module load नहीं हुआ।",
        "error"
      );

      return;

    }


    /*
     * Raw extraction
     */

    const extractBtn =
      $("extractBtn");


    if (extractBtn) {

      extractBtn.addEventListener(
        "click",
        handleExtract
      );

    }


    /*
     * Template change
     */

    const templateSelect =
      $("templateSelect");


    if (templateSelect) {

      templateSelect.addEventListener(
        "change",
        handleTemplateChange
      );

    }


    /*
     * Mapping
     */

    const mapBtn =
      $("mapBtn");


    if (mapBtn) {

      mapBtn.addEventListener(
        "click",
        createMapping
      );

    }


    /*
     * Validation
     */

    const validateBtn =
      $("validateBtn");


    if (validateBtn) {

      validateBtn.addEventListener(
        "click",
        validateDocument
      );

    }


    /*
     * JSON copy
     */

    const copyJsonBtn =
      $("copyJsonBtn");


    if (copyJsonBtn) {

      copyJsonBtn.addEventListener(
        "click",
        copyJSON
      );

    }


    /*
     * Initial UI
     */

    updateTemplateInfo();

    clearMapping();

    updateJSON();

  }


  /* =========================================
     START
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

    preview: renderValidationPreview

  };


})();
