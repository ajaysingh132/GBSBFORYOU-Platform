/*
 * Universal Template Engine
 * GBSBFORYOU / Ekaant AI Typing
 *
 * File: template-engine.js
 * Version: 0.1.0
 *
 * Purpose:
 * Template Schema
 * Field Mapping
 * Template Validation
 * Document Rendering
 *
 * Important:
 * यह engine स्वयं कोई तथ्य नहीं बनाता।
 * यह केवल उपलब्ध structured data को template fields से map करता है।
 */

(function () {
  "use strict";


  /* =========================================
     TEMPLATE ENGINE
  ========================================= */

  const TemplateEngine = {

    version: "0.1.0",

    templates: {},


    /* =========================================
       REGISTER TEMPLATE
    ========================================= */

    registerTemplate: function (template) {

      if (!template || !template.id) {

        throw new Error(
          "Template ID is required."
        );

      }

      if (!template.name) {

        throw new Error(
          "Template name is required."
        );

      }

      if (!Array.isArray(template.fields)) {

        throw new Error(
          "Template fields must be an array."
        );

      }

      this.templates[template.id] =
        this.clone(template);

      return this.templates[template.id];

    },


    /* =========================================
       GET TEMPLATE
    ========================================= */

    getTemplate: function (templateId) {

      return this.templates[templateId]
        ? this.clone(
            this.templates[templateId]
          )
        : null;

    },


    /* =========================================
       LIST TEMPLATES
    ========================================= */

    listTemplates: function () {

      return Object.values(
        this.templates
      ).map(
        template =>
          this.clone(template)
      );

    },


    /* =========================================
       REMOVE TEMPLATE
    ========================================= */

    removeTemplate: function (templateId) {

      if (
        Object.prototype.hasOwnProperty.call(
          this.templates,
          templateId
        )
      ) {

        delete this.templates[
          templateId
        ];

        return true;

      }

      return false;

    },


    /* =========================================
       FIELD MAPPING
    ========================================= */

    mapFields: function (
      sourceFields,
      templateId
    ) {

      const template =
        this.getTemplate(templateId);


      if (!template) {

        throw new Error(
          "Template not found: " +
          templateId
        );

      }


      const source =
        sourceFields || {};

      const mapping = [];


      template.fields.forEach(
        field => {

          const candidates =
            this.findCandidates(
              field,
              source
            );


          if (candidates.length) {

            const best =
              candidates[0];


            mapping.push({

              template_field:
                field.id,

              template_label:
                field.label,

              source_field:
                best.sourceField,

              value:
                best.value,

              method:
                best.method,

              confidence:
                best.confidence,

              confirmed:
                false

            });

          } else {

            mapping.push({

              template_field:
                field.id,

              template_label:
                field.label,

              source_field:
                null,

              value:
                "",

              method:
                "MISSING",

              confidence:
                0,

              confirmed:
                false

            });

          }

        }
      );


      return mapping;

    },


    /* =========================================
       FIND FIELD CANDIDATES
    ========================================= */

    findCandidates: function (
      templateField,
      sourceFields
    ) {

      const candidates = [];


      Object.keys(sourceFields)
        .forEach(
          sourceKey => {

            const source =
              sourceFields[
                sourceKey
              ];


            if (!source) {
              return;
            }


            const value =
              typeof source === "object"
                ? source.value
                : source;


            if (
              value === undefined ||
              value === null ||
              String(value).trim() === ""
            ) {

              return;

            }


            const templateId =
              this.normalize(
                templateField.id
              );


            const templateLabel =
              this.normalize(
                templateField.label ||
                ""
              );


            const sourceId =
              this.normalize(
                sourceKey
              );


            const sourceLabel =
              this.normalize(
                source.label ||
                ""
              );


            /* EXACT ID */

            if (
              sourceId === templateId
            ) {

              candidates.push({

                sourceField:
                  sourceKey,

                value:
                  String(value),

                method:
                  "EXACT",

                confidence:
                  1.0

              });

              return;

            }


            /* EXACT LABEL */

            if (
              sourceLabel &&
              sourceLabel ===
                templateLabel
            ) {

              candidates.push({

                sourceField:
                  sourceKey,

                value:
                  String(value),

                method:
                  "EXACT",

                confidence:
                  0.98

              });

              return;

            }


            /* SEMANTIC */

            const similarity =
              this.similarity(
                sourceId,
                templateId
              );


            if (
              similarity >= 0.65
            ) {

              candidates.push({

                sourceField:
                  sourceKey,

                value:
                  String(value),

                method:
                  "SEMANTIC",

                confidence:
                  similarity

              });

            }

          }
        );


      candidates.sort(
        (a, b) =>
          b.confidence -
          a.confidence
      );


      return candidates;

    },


    /* =========================================
       MANUAL MAPPING
    ========================================= */

    createManualMapping: function (
      templateField,
      sourceField,
      sourceFields
    ) {

      const source =
        sourceFields[sourceField];


      if (!source) {

        return {

          template_field:
            templateField,

          source_field:
            sourceField,

          value:
            "",

          method:
            "MISSING",

          confidence:
            0,

          confirmed:
            false

        };

      }


      const value =
        typeof source === "object"
          ? source.value
          : source;


      return {

        template_field:
          templateField,

        source_field:
          sourceField,

        value:
          String(value || ""),

        method:
          "MANUAL",

        confidence:
          1,

        confirmed:
          true

      };

    },


    /* =========================================
       APPLY MAPPING
    ========================================= */

    applyMapping: function (
      mapping
    ) {

      const result = {};


      (mapping || []).forEach(
        item => {

          result[
            item.template_field
          ] = {

            value:
              item.value || "",

            source_field:
              item.source_field,

            method:
              item.method,

            confidence:
              item.confidence,

            confirmed:
              item.confirmed === true

          };

        }
      );


      return result;

    },


    /* =========================================
       RENDER TEMPLATE
    ========================================= */

    render: function (
      templateId,
      data
    ) {

      const template =
        this.getTemplate(
          templateId
        );


      if (!template) {

        throw new Error(
          "Template not found: " +
          templateId
        );

      }


      let output =
        template.content || "";


      template.fields.forEach(
        field => {

          const item =
            data[field.id];


          const value =
            item &&
            item.value !== undefined
              ? item.value
              : "";


          const token =
            "{{" +
            field.id +
            "}}";


          output =
            output.split(
              token
            ).join(
              this.escapeText(
                String(value)
              )
            );

        }
      );


      return output;

    },


    /* =========================================
       FIND UNFILLED FIELDS
    ========================================= */

    getMissingFields: function (
      templateId,
      data
    ) {

      const template =
        this.getTemplate(
          templateId
        );


      if (!template) {

        return [];

      }


      return template.fields
        .filter(
          field =>
            field.required === true &&
            (
              !data[field.id] ||
              !data[field.id].value ||
              String(
                data[field.id].value
              ).trim() === ""
            )
        )
        .map(
          field => ({

            id:
              field.id,

            label:
              field.label

          })
        );

    },


    /* =========================================
       TEMPLATE VALIDATION
    ========================================= */

    validateTemplate: function (
      template
    ) {

      const errors = [];


      if (!template) {

        errors.push(
          "Template is missing."
        );

        return errors;

      }


      if (!template.id) {

        errors.push(
          "Template ID is missing."
        );

      }


      if (!template.name) {

        errors.push(
          "Template name is missing."
        );

      }


      if (
        !Array.isArray(
          template.fields
        )
      ) {

        errors.push(
          "Template fields must be an array."
        );

        return errors;

      }


      const ids = new Set();


      template.fields.forEach(
        field => {

          if (!field.id) {

            errors.push(
              "A template field has no ID."
            );

          }


          if (
            ids.has(field.id)
          ) {

            errors.push(
              "Duplicate field ID: " +
              field.id
            );

          }


          ids.add(field.id);

        }
      );


      return errors;

    },


    /* =========================================
       NORMALIZE
    ========================================= */

    normalize: function (
      value
    ) {

      return String(
        value || ""
      )
        .toLowerCase()
        .replace(
          /[_\-]+/g,
          " "
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    },


    /* =========================================
       BASIC SIMILARITY
    ========================================= */

    similarity: function (
      a,
      b
    ) {

      const first =
        this.normalize(a);

      const second =
        this.normalize(b);


      if (
        !first ||
        !second
      ) {

        return 0;

      }


      if (
        first === second
      ) {

        return 1;

      }


      const firstWords =
        new Set(
          first.split(" ")
        );


      const secondWords =
        new Set(
          second.split(" ")
        );


      let common = 0;


      firstWords.forEach(
        word => {

          if (
            secondWords.has(word)
          ) {

            common++;

          }

        }
      );


      const total =
        new Set([
          ...firstWords,
          ...secondWords
        ]).size;


      if (!total) {
        return 0;
      }


      return common / total;

    },


    /* =========================================
       SAFE CLONE
    ========================================= */

    clone: function (
      object
    ) {

      return JSON.parse(
        JSON.stringify(object)
      );

    },


    /* =========================================
       TEXT ESCAPING
    ========================================= */

    escapeText: function (
      value
    ) {

      /*
       * Preview text के लिए basic
       * normalization.
       *
       * HTML rendering अलग layer में
       * होने पर proper HTML escaping
       * वहाँ लागू की जाएगी.
       */

      return String(value)
        .replace(
          /\r\n/g,
          "\n"
        )
        .trim();

    }

  };


  /* =========================================
     DEFAULT MVP TEMPLATES
  ========================================= */

  const applicationTemplate = {

    id:
      "application-basic-001",

    name:
      "Basic Application",

    authority:
      "User Defined",

    country:
      "IN",

    jurisdiction:
      "General",

    language:
      "hi",

    version:
      "1.0",

    status:
      "USER_TEMPLATE",

    fields: [

      {
        id:
          "name",

        label:
          "Applicant Name",

        type:
          "text",

        required:
          true
      },

      {
        id:
          "address",

        label:
          "Address",

        type:
          "textarea",

        required:
          true
      },

      {
        id:
          "date",

        label:
          "Date",

        type:
          "date",

        required:
          true
      },

      {
        id:
          "subject",

        label:
          "Subject",

        type:
          "text",

        required:
          true
      }

    ],

    content:

      "आवेदन\n\n" +

      "आवेदक का नाम:
