const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');


// Field type constants remain the same
const FIELD_TYPES = {
  STRING: 'string',
  INTEGER: 'integer',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  DATE: 'date',
  OBJECT: 'object'
};

// Component type constants remain the same
const COMPONENT_TYPES = {
  TEXT_INPUT: 'text-input',
  TEXT_INPUT_MULTIPLE: 'text-input-multiple',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  SELECT_MULTIPLE: 'select-multiple',
  METHODOLOGY_SELECT: 'methodology-select',
  COUNTRY_SELECT: 'country-select',
  RADIO: 'radio',
  RADIOYN: 'radio-y-n',
  RADIOIDK: 'radio-y-n-idk',
  CHECKBOX: 'checkbox',
  YEAR_INPUT: 'year-input',
  MEDIA_CAROUSEL: 'media-carousel',
  FILE_UPLOAD_MULTIPLE: 'file-upload-multiple',
  FILE_UPLOAD: 'file-upload',
  DATE_PICKER: 'date-picker',
  DATA_GRID: 'data-grid',
  DATA_TABLE: 'data-table',
  RICH_TEXT: 'rich-text'
};

// Utility to generate values based on field type
const generateFieldData = (field, fileData = null, fileTierFilter = null) => {
  switch (field.component) {
    case COMPONENT_TYPES.TEXT_INPUT:
    case COMPONENT_TYPES.TEXTAREA:
      if (FIELD_TYPES.NUMBER === field.type || FIELD_TYPES.INTEGER === field.type) {
        return faker.number.int(100).toString();
      } else {
        if(field.name == "projectMission-nameValue-nameValue"){
          return faker.lorem.words(75);
        }else{
          return faker.lorem.words(3);
        }
      }

    case COMPONENT_TYPES.RICH_TEXT:
      return faker.lorem.words(3);

    case COMPONENT_TYPES.SELECT:
      if (field.label == 'Project type') {
        return "Improved Forest Management (IFM)";
      }
      return field.options[0];

    case COMPONENT_TYPES.SELECT_MULTIPLE:
      let value = [];
      for (const option of field.options) {
        value.push(option);
      }
      return JSON.stringify(value);

    case COMPONENT_TYPES.COUNTRY_SELECT:
      return '["GB","IN"]';

    case COMPONENT_TYPES.YEAR_INPUT:
      return field.label.includes('start year') ? faker.date.past({ years: 10 }).getFullYear().toString() : faker.date.future({ years: 10 }).getFullYear().toString();

    case COMPONENT_TYPES.CHECKBOX:
      return JSON.stringify(field.options);

    case COMPONENT_TYPES.RADIOYN:
    case COMPONENT_TYPES.RADIOIDK:
      return "Yes";

    case COMPONENT_TYPES.RADIO:
      return field.options[0];

    case COMPONENT_TYPES.DATE_PICKER:
      return faker.date.past().toISOString().split('T')[0];

    case COMPONENT_TYPES.TEXT_INPUT_MULTIPLE:
      if (FIELD_TYPES.STRING === field.type) {
        const latitude = faker.location.latitude();
        const longitude = faker.location.longitude();
        return `${latitude}, ${longitude}`;
      }
      return "[\"Kolkata\"]"

    case COMPONENT_TYPES.FILE_UPLOAD:
    case COMPONENT_TYPES.FILE_UPLOAD_MULTIPLE:
      if (fileData && (fileTierFilter === null || fileTierFilter === field.tier)) {
        const projectFileType = field.name?.split('-')[0];
        fileData.push({
          configFieldId: field.id,
          projectFileType
        });
      }

    // default:   
    //   return faker.lorem.words(2);
  }
};

// Traverse topics and extract field values
export const extractFieldsFromTopics = async () => {
  const filePath = path.join(__dirname, '..', 'data', 'form-data.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(rawData);

  const topics = jsonData.topics;

  const items = [];
  const currentValues = {}; // to track fields for dependency check
  const fileData = [];

  topics.forEach(topic => {
    topic.step_groups?.forEach(stepGroup => {
      stepGroup.steps?.forEach(step => {
        step.sections?.forEach(section => {
          section.field_groups?.forEach(fieldGroup => {
            fieldGroup.fields?.forEach(field => {
              const { name, display_dependencies } = field;

              // Check dependency if it exists
              if (display_dependencies?.length > 0) {
                const allDepsSatisfied = display_dependencies.every(dep => {
                  const actualVal = currentValues[dep.field];
                  const pattern = dep.pattern;

                  if (!actualVal) return false;

                  try {
                    const parsedValue = JSON.parse(actualVal);

                    if (Array.isArray(parsedValue)) {
                      return parsedValue.includes(pattern);
                    } else {
                      return parsedValue === pattern;
                    }
                  } catch (e) {
                    // actualVal is not a JSON string, compare directly
                    return actualVal === pattern;
                  }
                });

                if (!allDepsSatisfied) {
                  return; // skip this field
                }
              }

              // Generate fake data
              const value = generateFieldData(field, fileData, 0);
              const cleanKeyName = name.replace(/-nameValue(-nameValue)?$/, '')
              if (value) {
                items.push({ keyName: cleanKeyName, value });
                currentValues[name] = value;
              }
            });
          });
        });
      });
    });
  });

  const finalData = { fields: { items }, fileData };

  const outputPath = path.join(__dirname, '..', 'data', 'Project-data-new.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
};

const excludedNames = [
  'name-grapheneProject-iwa',
  'projectScale-modularBenefitProject-iwa',
  'projectType-modularBenefitProject-iwa',
  'domain-grapheneProject-iwa',
  'classificationCategory-modularBenefitProject-iwa',
  'classificationMethod-modularBenefitProject-iwa'
];

// Traverse topics and extract field values where tier = 0
export const extractTier0FieldsFromTopics = async () => {
  const filePath = path.join(__dirname, '..', 'data', 'form-data.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(rawData);

  const topics = jsonData.topics;

  const items = [];
  const currentValues = {}; // to track fields for dependency check
  const fileData = [];

  topics.forEach(topic => {
    topic.step_groups?.forEach(stepGroup => {
      stepGroup.steps?.forEach(step => {
        step.sections?.forEach(section => {
          section.field_groups?.forEach(fieldGroup => {
            fieldGroup.fields?.forEach(field => {
              const { name, display_dependencies, tier } = field;

              // Skip fields with excluded names
              if (excludedNames.includes(name)) return;

              // Filter: Only include fields with tier = 0
              if (tier !== 0) return;

              // Check display dependencies if they exist
              if (display_dependencies?.length > 0) {
                const allDepsSatisfied = display_dependencies.every(dep => {
                  const actualVal = currentValues[dep.field];
                  const pattern = dep.pattern;

                  if (!actualVal) return false;

                  try {
                    const parsedValue = JSON.parse(actualVal);

                    if (Array.isArray(parsedValue)) {
                      return parsedValue.includes(pattern);
                    } else {
                      return parsedValue === pattern;
                    }
                  } catch (e) {
                    return actualVal === pattern;
                  }
                });

                if (!allDepsSatisfied) {
                  return; // skip this field
                }
              }

              // Generate fake data
              const value = generateFieldData(field, fileData, 0);
              const cleanKeyName = name.replace(/-nameValue(-nameValue)?$/, '');

              if (value) {
                items.push({ keyName: cleanKeyName, value });
                currentValues[name] = value;
              }
            });
          });
        });
      });
    });
  });

  const finalData = { fields: { items }, fileData };

  const outputPath = path.join(__dirname, '..', 'data', 'Project-publish-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
};

export const extractNonTier0FieldsFromTopics = async () => {
  const filePath = path.join(__dirname, '..', 'data', 'form-data.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(rawData);

  const topics = jsonData.topics;

  const items = [];
  const currentValues = {}; // to track fields for dependency check
  const fileData = [];

  topics.forEach(topic => {
    topic.step_groups?.forEach(stepGroup => {
      stepGroup.steps?.forEach(step => {
        step.sections?.forEach(section => {
          section.field_groups?.forEach(fieldGroup => {
            fieldGroup.fields?.forEach(field => {
              const { name, display_dependencies, tier } = field;

              // Skip fields with excluded names
              if (excludedNames.includes(name)) {
                console.log(`Excluded field: ${name}`);
                return;
              }

              // Filter: Only include fields with tier !== 0
              if (tier === 0 || tier == null) return;

              // Check display dependencies if they exist
              if (display_dependencies && display_dependencies.length > 0) {
                const allDepsSatisfied = display_dependencies.every(dep => {
                  const actualVal = currentValues[dep.field];
                  const pattern = dep.pattern;

                  if (!actualVal) return false;

                  try {
                    const parsedValue = JSON.parse(actualVal);

                    if (Array.isArray(parsedValue)) {
                      return parsedValue.includes(pattern);
                    } else {
                      return parsedValue === pattern;
                    }
                  } catch (e) {
                    return actualVal === pattern;
                  }
                });

                if (!allDepsSatisfied) {
                  return; // skip this field
                }
              }

              // Generate fake data
              const value = generateFieldData(field, fileData, tier); // File only if tier ≠ 0
              const cleanKeyName = name.replace(/-nameValue(-nameValue)?$/, '');

              if (value) {
                items.push({ keyName: cleanKeyName, value });
                currentValues[name] = value;
              }
            });
          });
        });
      });
    });
  });

  const finalData = { fields: { items }, fileData };

  const outputPath = path.join(__dirname, '..', 'data', 'Project-publish-data-non-tier0.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
};
