/*
 * Universal Template Engine — MVP
 * GBSBFORYOU / Ekaant AI Typing
 *
 * Version: 0.1.0
 * Purpose:
 * Raw Text → Field Extraction → Review → Validation → Preview → JSON
 *
 * Security:
 * No API key, password or private credential is stored here.
 */

(function () {
  "use strict";

  /* ==============================
     FIELD DICTIONARY
  ============================== */

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


  /* ==============================
     FIELD LABELS
  ============================== */

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


  /* ==============================
     TEMPLATE DEFINITIONS
  ============================== */

  const TEMPLATES = {
    application: {
      id: "application",
      name: "Basic Application",
      required: [
        "name",
        "address",
        "date",
        "subject"
      ]
    },

    letter: {
      id: "letter",
      name: "Basic Official Letter",
      required: [
        "name",
        "address",
        "date",
        "subject"
      ]
    }
  };


  /* ==============================
     APPLICATION STATE
  ============================== */

  const state = {
    rawText: "",
    fields: {},
    template: "application",
    confirmed: false
  };


  /* ==============================
     DOM HELPER
  ============================== */

  function $(id) {
    return document.getElementById(id);
  }


  /* ==============================
     NORMALIZE KEY
  ============================== */

  function normalizeKey(key) {
    return key
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }


  /* ==============================
     FIELD EXTRACTION
  ============================== */

  function extractFields(text) {

    const fields = {};

    const lines = text.split(/\r?\n/);

    lines.forEach(function (line) {

      const separator = line.indexOf(":");

      if (separator === -1) {
        return;
      }

      const rawKey = normalizeKey(
        line.substring(0, separator)
      );

      const value = line
        .substring(separator + 1)
        .trim();

      if (!value) {
        return;
      }

      const fieldName =
        FIELD_DICTIONARY[rawKey];

      if (!fieldName) {
        return;
      }

      fields[fieldName] = {

        value: value,

        source: "USER_PROVIDED",

        confidence: 1,

        confirmed: false

      };

    });

    return fields;
  }


  /* ==============================
     RENDER FIELDS
  ============================== */

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

      input.type = "text";

      input.value =
        item.value;

      input.dataset.field =
        key;


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


  /* ==============================
     VALIDATION
  ============================== */

  function validateFields() {

    const template =
      TEMPLATES[state.template];

    if (!template) {
      return [];
    }

    return template.required.filter(
      function (field) {

        return (
          !state.fields[field] ||
          !state.fields[field].value ||
          !state.fields[field].value.trim()
        );

      }
    );

  }


  /* ==============================
     DOCUMENT PREVIEW
  ============================== */

  function buildPreview() {

    function get(field) {

      if (
        state.fields[field] &&
        state.fields[field].value
      ) {

        return state.fields[field]
          .value
          .trim();

      }

      return "[MISSING]";
    }


    if (
      state.template === "letter"
    ) {

      return [

        "आधिकारिक पत्र",

        "",

        "प्रेषक: " +
        get("name"),

        "पता: " +
        get("address"),

        "",

        "विषय: " +
        get("subject"),

        "",

        "दिनांक: " +
        get("date")

      ].join("\n");

    }


    return [

      "आवेदन",

      "",

      "आवेदक का नाम: " +
      get("name"),

      "पता: " +
      get("address"),

      "",

      "विषय: " +
      get("subject"),

      "",

      "दिनांक: " +
      get("date"),

      "",

      "आवेदक:",

      get("name")

    ].join("\n");

  }


  /* ==============================
     JSON OUTPUT
  ============================== */

  function updateJSON() {

    const output = {

      project:
        "GBSBFORYOU Universal Template Engine",

      version:
        "0.1.0",

      template:
        state.template,

      template_name:
        TEMPLATES[state.template]
          ? TEMPLATES[state.template].name
          : "",

      raw_input:
        state.rawText,

      confirmed:
        state.confirmed,

      fields:
        state.fields

    };


    const outputBox =
      $("jsonOutput");

    if (outputBox) {

      outputBox.value =
        JSON.stringify(
          output,
          null,
          2
        );

    }

  }


  /* ==============================
     STATUS MESSAGE
  ============================== */

  function showStatus(
    message,
    type
  ) {

    const box =
      $("statusBox");

    if (!box) {
      return;
    }

    box.className =
      "status " + type;

    box.textContent =
      message;

  }


  /* ==============================
     EXTRACT BUTTON
  ============================== */

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

    state.confirmed =
      false;


    renderFields();

    updateJSON();


    const count =
      Object.keys(
        state.fields
      ).length;


    if (!count) {

      showStatus(

        "कोई recognized field नहीं मिली। " +
        "उदाहरण: नाम: अजय सिंह चौहान",

        "warning"

      );

      return;

    }


    showStatus(

      count +
      " field निकाली गई। " +
      "कृपया जानकारी की जाँच करें।",

      "success"

    );

  }


  /* ==============================
     TEMPLATE CHANGE
  ============================== */

  function handleTemplateChange(
    event
  ) {

    state.template =
      event.target.value;

    state.confirmed =
      false;

    updateJSON();

  }


  /* ==============================
     VALIDATE + PREVIEW
  ============================== */

  function handleValidate() {

    const missing =
      validateFields();


    if (missing.length) {

      const names =
        missing.map(
          function (key) {

            return (
              FIELD_LABELS[key] ||
              key
            );

          }
        );


      showStatus(

        "आवश्यक जानकारी missing है: " +
        names.join(", "),

        "error"

      );


      const preview =
        $("previewBox");

      if (preview) {

        preview.textContent =
          "Document तैयार नहीं किया जा सकता। " +
          "Missing fields भरें।";

      }

      return;

    }


    state.confirmed =
      true;


    Object.keys(
      state.fields
    ).forEach(
      function (key) {

        state.fields[key]
          .confirmed = true;

      }
    );


    const preview =
      $("previewBox");

    if (preview) {

      preview.textContent =
        buildPreview();

    }


    updateJSON();


    showStatus(

      "Validation सफल। Preview तैयार है।",

      "success"

    );

  }


  /* ==============================
     COPY JSON
  ============================== */

  async function handleCopyJSON() {

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

      /*
       * Clipboard API unavailable होने पर
       * fallback selection.
       */

      output.focus();

      output.select();

      showStatus(

        "JSON select हो गया है। Copy करें।",

        "warning"

      );

    }

  }


  /* ==============================
     INITIALIZE
  ============================== */

  function init() {

    const extractButton =
      $("extractBtn");

    if (extractButton) {

      extractButton
        .addEventListener(
          "click",
          handleExtract
        );

    }


    const validateButton =
      $("validateBtn");

    if (validateButton) {

      validateButton
        .addEventListener(
          "click",
          handleValidate
        );

    }


    const templateSelect =
      $("templateSelect");

    if (templateSelect) {

      templateSelect
        .addEventListener(
          "change",
          handleTemplateChange
        );

    }


    const copyButton =
      $("copyJsonBtn");

    if (copyButton) {

      copyButton
        .addEventListener(
          "click",
          handleCopyJSON
        );

    }


    updateJSON();

  }


  /*
   * Start after DOM is ready.
   */

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


  /*
   * Optional public API.
   *
   * Future modules such as
   * template-engine.js and validator.js
   * can use these functions after
   * architecture integration.
   */

  window.EkaantTemplateEngine = {

    extractFields,
    validateFields,
    buildPreview,
    updateJSON,

    getState: function () {

      return state;

    }

  };

})();
