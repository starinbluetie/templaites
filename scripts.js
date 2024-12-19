import './eventListeners.js';
import './state.js';
import { renderTemplateList } from './template.js';

const templateForm = document.getElementById('template-form');
const templateInput = document.getElementById('template-input');
const tagsInput = document.getElementById('tags-input');
const promptListInput = document.getElementById('prompt-list-input');
const templateList = document.getElementById('template-list');
const filterInput = document.getElementById('filter-input');
const sortSelect = document.getElementById('sort-select');
const editTemplateSection = document.getElementById('edit-template');
const templatePreview = document.getElementById('template-preview');
const editTemplateInput = document.getElementById('edit-template-input');
const editTagsInput = document.getElementById('edit-tags-input');
const saveChangesButton = document.getElementById('save-changes-button');
const deleteTemplateButtonMain = document.getElementById('delete-template-button-main');
const versionHistorySection = document.getElementById('version-history');
const versionList = document.getElementById('version-list');
const restoreVersionButton = document.getElementById('restore-version-button');
const cancelEditButton = document.getElementById('cancel-edit-button');

let currentTemplate = null;

// Initialize the application
renderTemplateList(templateList);
