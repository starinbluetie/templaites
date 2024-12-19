import { templates } from './storage.js';

export function renderTemplateList(filteredTemplates = templates) {
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

export function displayTemplateDetails(template) {
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

export function collapseEditSection() {
    editTemplateSection.style.display = 'none';
    versionHistorySection.style.display = 'none';
    currentTemplate = null;
}
