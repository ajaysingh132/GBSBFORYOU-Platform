/*
 * Universal Template Engine
 * GBSBFORYOU / Ekaant AI Typing
 *
 * File: validator.js
 * Version: 0.1.0
 *
 * Purpose:
 * Validate structured data before it is
 * merged into a document template.
 *
 * Principle:
 * Missing information must be reported.
 * The system must never fabricate facts.
 */

(function () {
  "use strict";


  /* =========================================
     VALIDATOR
  ========================================= */

  const Validator = {

    version: "0.1.0",


    /* =========================================
       MAIN VALIDATION
    ========================================= */

    validate: function (
      template,
      data
    ) {

      const errors = [];

      const warnings = [];

      const fields = data || {};


      if (!template) {

        errors.push({
          code: "TEMPLATE_MISSING",
          message: "Template उपलब्ध नहीं है।"
        });

        return {
          valid: false,
          errors: errors,
          warnings: warnings
        };

      }


      if (
        !Array.isArray(
          template.fields
        )
      ) {

        errors.push({
          code: "TEMPLATE_FIELDS_INVALID",
          message:
            "Template fields की संरचना सही नहीं है।"
        });

        return {
          valid: false,
          errors: errors,
          warnings: warnings
        };

      }


      template.fields.forEach(
        field => {

          const value =
            this.getValue(
              fields,
              field.id
            );


          /* Required field */

          if (
            field.required === true &&
            !this.hasValue(value)
          ) {

            errors.push({

              code:
                "REQUIRED_FIELD_MISSING",

              field:
                field.id,

              label:
                field.label || field.id,

              message:
                (
                  field.label ||
                  field.id
                ) +
                " आवश्यक है।"

            });

            return;

          }


          /*
           * Optional empty field
           * does not create an error.
           */

          if (
            !this.hasValue(value)
          ) {

            return;

          }


          /* Type validation */

          const typeResult =
            this.validateType(
              value,
              field.type
            );


          if (
            !typeResult.valid
          ) {

            errors.push({

              code:
                "INVALID_FIELD_TYPE",

              field:
                field.id,

              label:
                field.label ||
                field.id,

              message:
                typeResult.message

            });

          }


          /* Format validation */

          if (
            field.format
          ) {

            const formatResult =
              this.validateFormat(
                value,
                field.format
              );


            if (
              !formatResult.valid
            ) {

              errors.push({

                code:
                  "INVALID_FIELD_FORMAT",

                field:
                  field.id,

                label:
                  field.label ||
                  field.id,

                message:
                  formatResult.message

              });

            }

          }


          /* Length validation */

          if (
            field.minLength !== undefined ||
            field.maxLength !== undefined
          ) {

            const lengthResult =
              this.validateLength(
                value,
                field.minLength,
                field.maxLength
              );


            if (
              !lengthResult.valid
            ) {

              errors.push({

                code:
                  "INVALID_FIELD_LENGTH",

                field:
                  field.id,

                label:
                  field.label ||
                  field.id,

                message:
                  lengthResult.message

              });

            }

          }

        }
      );


      /*
       * Check AI inferred information.
       */

      Object.keys(fields)
        .forEach(
          key => {

            const item =
              fields[key];

            if (
              item &&
              item.source ===
                "AI_INFERRED" &&
              item.confirmed !== true
            ) {

              warnings.push({

                code:
                  "AI_INFERRED_NOT_CONFIRMED",

                field:
                  key,

                message:
                  "AI द्वारा अनुमानित जानकारी " +
                  "अभी user द्वारा confirm नहीं की गई है।"

              });

            }

          }
        );


      /*
       * Final result
       */

      return {

        valid:
          errors.length === 0,

        errors:
          errors,

        warnings:
          warnings,

        errorCount:
          errors.length,

        warningCount:
          warnings.length

      };

    },


    /* =========================================
       GET VALUE
    ========================================= */

    getValue: function (
      data,
      fieldId
    ) {

      if (
        !data ||
        !Object.prototype.hasOwnProperty.call(
          data,
          fieldId
        )
      ) {

        return "";

      }


      const item =
        data[fieldId];


      /*
       * Structured field:
       * { value: "..." }
       */

      if (
        item &&
        typeof item === "object" &&
        Object.prototype.hasOwnProperty.call(
          item,
          "value"
        )
      ) {

        return item.value;

      }


      return item;

    },


    /* =========================================
       HAS VALUE
    ========================================= */

    hasValue: function (
      value
    ) {

      if (
        value === null ||
        value === undefined
      ) {

        return false;

      }


      return String(value)
        .trim()
        .length > 0;

    },


    /* =========================================
       TYPE VALIDATION
    ========================================= */

    validateType: function (
      value,
      type
    ) {

      if (!type) {

        return {
          valid: true
        };

      }


      const text =
        String(value).trim();


      switch (type) {

        case "text":

        case "textarea":

          return {
            valid: true
          };


        case "date":

          if (
            this.isValidDate(text)
          ) {

            return {
              valid: true
            };

          }

          return {

            valid: false,

            message:
              "दिनांक का format मान्य नहीं है।"

          };


        case "email":

          if (
            this.isValidEmail(text)
          ) {

            return {
              valid: true
            };

          }

          return {

            valid: false,

            message:
              "ईमेल address मान्य नहीं है।"

          };


        case "phone":

          if (
            this.isValidPhone(text)
          ) {

            return {
              valid: true
            };

          }

          return {

            valid: false,

            message:
              "मोबाइल नंबर मान्य नहीं है।"

          };


        case "number":

          if (
            this.isValidNumber(text)
          ) {

            return {
              valid: true
            };

          }

          return {

            valid: false,

            message:
              "संख्या मान्य नहीं है।"

          };


        default:

          /*
           * Unknown type को reject नहीं करते।
           * Future extensibility के लिए अनुमति।
           */

          return {
            valid: true
          };

      }

    },


    /* =========================================
       FORMAT VALIDATION
    ========================================= */

    validateFormat: function (
      value,
      format
    ) {

      const text =
        String(value).trim();


      if (
        !format
      ) {

        return {
          valid: true
        };

      }


      switch (format) {

        case "email":

          return this.isValidEmail(
            text
          )
            ? {
                valid: true
              }
            : {
                valid: false,
                message:
                  "ईमेल format सही नहीं है।"
              };


        case "phone":

          return this.isValidPhone(
            text
          )
            ? {
                valid: true
              }
            : {
                valid: false,
                message:
                  "फोन number format सही नहीं है।"
              };


        case "date":

          return this.isValidDate(
            text
          )
            ? {
                valid: true
              }
            : {
                valid: false,
                message:
                  "Date format सही नहीं है।"
              };


        default:

          return {
            valid: true
          };

      }

    },


    /* =========================================
       LENGTH VALIDATION
    ========================================= */

    validateLength: function (
      value,
      minLength,
      maxLength
    ) {

      const length =
        String(value).trim().length;


      if (
        minLength !== undefined &&
        length < minLength
      ) {

        return {

          valid: false,

          message:
            "जानकारी कम से कम " +
            minLength +
            " characters की होनी चाहिए।"

        };

      }


      if (
        maxLength !== undefined &&
        length > maxLength
      ) {

        return {

          valid: false,

          message:
            "जानकारी अधिकतम " +
            maxLength +
            " characters की होनी चाहिए।"

        };

      }


      return {
        valid: true
      };

    },


    /* =========================================
       EMAIL
    ========================================= */

    isValidEmail: function (
      value
    ) {

      /*
       * Basic email validation.
       * यह पूर्ण RFC parser नहीं है।
       */

      const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return pattern.test(
        String(value).trim()
      );

    },


    /* =========================================
       PHONE
    ========================================= */

    isValidPhone: function (
      value
    ) {

      /*
       * International + और digits
       * दोनों की अनुमति।
       */

      const cleaned =
        String(value)
          .replace(
            /[\s\-()]/g,
            ""
          );


      return /^\+?[0-9]{7,15}$/
        .test(cleaned);

    },


    /* =========================================
       NUMBER
    ========================================= */

    isValidNumber: function (
      value
    ) {

      const normalized =
        String(value)
          .replace(/,/g, "")
          .trim();


      return normalized !== "" &&
        !Number.isNaN(
          Number(normalized)
        );

    },


    /* =========================================
       DATE
    ========================================= */

    isValidDate: function (
      value
    ) {

      const text =
        String(value).trim();


      /*
       * ISO date:
       * YYYY-MM-DD
       */

      if (
        /^\d{4}-\d{2}-\d{2}$/
          .test(text)
      ) {

        const date =
          new Date(
            text + "T00:00:00"
          );


        return (
          !Number.isNaN(
            date.getTime()
          ) &&
          date.toISOString()
            .slice(0, 10) === text
        );

      }


      /*
       * Common Indian numeric date:
       * DD/MM/YYYY
       */

      if (
        /^\d{2}\/\d{2}\/\d{4}$/
          .test(text)
      ) {

        const parts =
          text.split("/");

        const day =
          Number(parts[0]);

        const month =
          Number(parts[1]);

        const year =
          Number(parts[2]);


        const date =
          new Date(
            year,
            month - 1,
            day
          );


        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );

      }


      /*
       * Hindi written dates जैसे:
       * 14 अगस्त 2026
       *
       * को MVP में reject नहीं करेंगे।
       * इसे user-provided text माना जाएगा।
       */

      if (
        /[अ-ह]/.test(text) &&
        /\d{4}/.test(text)
      ) {

        return true;

      }


      return false;

    },


    /* =========================================
       TEMPLATE CHECK
    ========================================= */

    validateTemplate: function (
      template
    ) {

      const errors = [];


      if (!template) {

        errors.push(
          "Template उपलब्ध नहीं है।"
        );

        return {

          valid: false,

          errors: errors

        };

      }


      if (!template.id) {

        errors.push(
          "Template ID missing है।"
        );

      }


      if (!template.name) {

        errors.push(
          "Template name missing है।"
        );

      }


      if (
        !Array.isArray(
          template.fields
        )
      ) {

        errors.push(
          "Template fields array missing है।"
        );

        return {

          valid:
            errors.length === 0,

          errors:
            errors

        };

      }


      const ids =
        new Set();


      template.fields.forEach(
        field => {

          if (!field.id) {

            errors.push(
              "एक template field का ID missing है।"
            );

          }


          if (
            field.id &&
            ids.has(field.id)
          ) {

            errors.push(
              "Duplicate template field: " +
              field.id
            );

          }


          if (field.id) {

            ids.add(
              field.id
            );

          }

        }
      );


      return {

        valid:
          errors.length === 0,

        errors:
          errors

      };

    },


    /* =========================================
       FABRICATION SAFETY CHECK
    ========================================= */

    checkFabricationRisk: function (
      data
    ) {

      const warnings = [];


      Object.keys(
        data || {}
      ).forEach(
        key => {

          const item =
            data[key];


          if (
            item &&
            typeof item === "object" &&
            item.source ===
              "AI_INFERRED" &&
            item.confirmed !== true
          ) {

            warnings.push({

              field:
                key,

              message:
                "यह field AI-inferred है " +
                "और user confirmation आवश्यक है।"

            });

          }

        }
      );


      return {

        safe:
          warnings.length === 0,

        warnings:
          warnings

      };

    },


    /* =========================================
       FINAL DOCUMENT CHECK
    ========================================= */

    canGenerate: function (
      template,
      data
    ) {

      const result =
        this.validate(
          template,
          data
        );


      const fabrication =
        this.checkFabricationRisk(
          data
        );


      return {

        allowed:
          result.valid &&
          fabrication.safe,

        validation:
          result,

        fabrication:
          fabrication

      };

    }

  };


  /* =========================================
     GLOBAL EXPORT
  ========================================= */

  window.UniversalTemplateValidator =
    Validator;


})();
