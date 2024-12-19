const templateForm = document.getElementById('template-form');
const promptInput = document.getElementById('prompt-input');
const tagsInput = document.getElementById('tags-input');
const templateList = document.getElementById('template-list');
const filterInput = document.getElementById('filter-input');
const sortSelect = document.getElementById('sort-select');
const editTemplateSection = document.getElementById('edit-template');
const templatePreview = document.getElementById('template-preview');
const editPromptInput = document.getElementById('edit-prompt-input');
const editTagsInput = document.getElementById('edit-tags-input');
const saveChangesButton = document.getElementById('save-changes-button');
const deleteTemplateButton = document.getElementById('delete-template-button');
const versionHistorySection = document.getElementById('version-history');
const versionList = document.getElementById('version-list');
const restoreVersionButton = document.getElementById('restore-version-button');

let templates = JSON.parse(localStorage.getItem('templates')) || [];
let currentTemplate = null;

function saveTemplates() {
    localStorage.setItem('templates', JSON.stringify(templates));
}

function renderTemplateList() {
    templateList.innerHTML = '';
    templates.forEach(template => {
        const listItem = document.createElement('li');
        listItem.textContent = `${template.prompt} (${template.tags})`;
        listItem.addEventListener('click', () => {
            currentTemplate = template;
            displayTemplateDetails(template);
        });
        templateList.appendChild(listItem);
    });
}

function displayTemplateDetails(template) {
    editTemplateSection.style.display = 'block';
    templatePreview.innerHTML = `<p>${template.prompt}</p><p>${template.tags}</p>`;
    editPromptInput.value = template.prompt;
    editTagsInput.value = template.tags;
    versionHistorySection.style.display = 'block';
    versionList.innerHTML = '';
    template.versions.forEach((version, index) => {
        const versionItem = document.createElement('li');
        versionItem.textContent = `Version ${index + 1}: ${version.prompt} (${version.tags})`;
        versionList.appendChild(versionItem);
    });
}

templateForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newTemplate = {
        prompt: promptInput.value,
        tags: tagsInput.value,
        versions: []
    };
    templates.push(newTemplate);
    saveTemplates();
    renderTemplateList();
    promptInput.value = '';
    tagsInput.value = '';
});

saveChangesButton.addEventListener('click', function() {
    if (currentTemplate) {
        currentTemplate.versions.push({
            prompt: currentTemplate.prompt,
            tags: currentTemplate.tags
        });
        currentTemplate.prompt = editPromptInput.value;
        currentTemplate.tags = editTagsInput.value;
        saveTemplates();
        renderTemplateList();
        displayTemplateDetails(currentTemplate);
    }
});

deleteTemplateButton.addEventListener('click', function() {
    if (currentTemplate) {
        templates = templates.filter(template => template !== currentTemplate);
        saveTemplates();
        renderTemplateList();
        editTemplateSection.style.display = 'none';
        versionHistorySection.style.display = 'none';
    }
});

restoreVersionButton.addEventListener('click', function() {
    if (currentTemplate && currentTemplate.versions.length > 0) {
        const lastVersion = currentTemplate.versions.pop();
        currentTemplate.prompt = lastVersion.prompt;
        currentTemplate.tags = lastVersion.tags;
        saveTemplates();
        renderTemplateList();
        displayTemplateDetails(currentTemplate);
    }
});

filterInput.addEventListener('input', function() {
    const filterText = filterInput.value.toLowerCase();
    const filteredTemplates = templates.filter(template => 
        template.prompt.toLowerCase().includes(filterText) || 
        template.tags.toLowerCase().includes(filterText)
    );
    renderTemplateList(filteredTemplates);
});

sortSelect.addEventListener('change', function() {
    const sortBy = sortSelect.value;
    if (sortBy === 'date') {
        templates.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'name') {
        templates.sort((a, b) => a.prompt.localeCompare(b.prompt));
    }
    renderTemplateList();
});

renderTemplateList();
