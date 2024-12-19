import { templates } from './storage.js';
import { currentTemplate, setCurrentTemplate } from './state.js';

const editTemplateSection = document.getElementById('edit-template');
const templatePreview = document.getElementById('template-preview');
const editTemplateInput = document.getElementById('edit-template-input');
const editTagsInput = document.getElementById('edit-tags-input');
const editPromptListInput = document.getElementById('edit-prompt-list-input');
const versionHistorySection = document.getElementById('version-history');
const versionList = document.getElementById('version-list');

export function renderTemplateList(templateList, filteredTemplates = templates) {
    templateList.innerHTML = '';
    filteredTemplates.forEach(template => {
        const listItem = document.createElement('li');
        listItem.textContent = `${template.template} (${template.tags})`;
        listItem.addEventListener('click', () => {
            setCurrentTemplate(template);
            displayTemplateDetails(template);
        });
        templateList.appendChild(listItem);
    });
}

export function displayTemplateDetails(template) {
    editTemplateSection.style.display = 'block';
    templatePreview.innerHTML = `<p>${template.template}</p><p>${template.tags}</p>`;
    editTemplateInput.value = template.template;
    editTagsInput.value = template.tags;
    editPromptListInput.value = template.promptList.map(item => item.replace(/^\d+\.\s*/, '')).join('\n');
    versionHistorySection.style.display = 'block';
    versionList.innerHTML = '';
    template.versions.forEach((version, index) => {
        const versionItem = document.createElement('li');
        versionItem.textContent = `Version ${index + 1}: ${version.template} (${version.tags})`;
        versionList.appendChild(versionItem);
    });
}

export function collapseEditSection() {
    editTemplateSection.style.display = 'none';
    versionHistorySection.style.display = 'none';
    setCurrentTemplate(null);
}
