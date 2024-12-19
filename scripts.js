import './storage.js';
import './template.js';
import './eventListeners.js';
// import './utils.js'; // Uncomment if utility functions are added

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
const deleteTemplateButton = document.getElementById('delete-template-button');
const versionHistorySection = document.getElementById('version-history');
const versionList = document.getElementById('version-list');
const restoreVersionButton = document.getElementById('restore-version-button');
const cancelEditButton = document.getElementById('cancel-edit-button');

let templates = JSON.parse(localStorage.getItem('templates')) || [];
let currentTemplate = null;

function saveTemplates() {
    localStorage.setItem('templates', JSON.stringify(templates));
}

function renderTemplateList(filteredTemplates = templates) {
    templateList.innerHTML = '';
    filteredTemplates.forEach(template => {
        const listItem = document.createElement('li');
        listItem.textContent = `${template.template} (${template.tags})`;
        listItem.addEventListener('click', () => {
            currentTemplate = template;
            displayTemplateDetails(template);
        });
        templateList.appendChild(listItem);
    });
}

function displayTemplateDetails(template) {
    editTemplateSection.style.display = 'block';
    templatePreview.innerHTML = `<p>${template.template}</p><p>${template.tags}</p>`;
    editTemplateInput.value = template.template;
    editTagsInput.value = template.tags;
    versionHistorySection.style.display = 'block';
    versionList.innerHTML = '';
    template.versions.forEach((version, index) => {
        const versionItem = document.createElement('li');
        versionItem.textContent = `Version ${index + 1}: ${version.template} (${version.tags})`;
        versionList.appendChild(versionItem);
    });
}

function collapseEditSection() {
    editTemplateSection.style.display = 'none';
    versionHistorySection.style.display = 'none';
    currentTemplate = null;
}

// Initialize the application
renderTemplateList();
