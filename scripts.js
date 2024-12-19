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

templateForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newTemplate = {
        template: templateInput.value,
        tags: tagsInput.value,
        promptList: [],
        versions: []
    };
    templates.push(newTemplate);
    saveTemplates();
    renderTemplateList();
    templateInput.value = '';
    tagsInput.value = '';
});

promptListInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (currentTemplate) {
            currentTemplate.promptList.push(promptListInput.value);
            saveTemplates();
            displayTemplateDetails(currentTemplate);
            promptListInput.value = '';
        }
    }
});

saveChangesButton.addEventListener('click', function() {
    if (currentTemplate) {
        currentTemplate.versions.push({
            template: currentTemplate.template,
            tags: currentTemplate.tags,
            promptList: [...currentTemplate.promptList]
        });
        currentTemplate.template = editTemplateInput.value;
        currentTemplate.tags = editTagsInput.value;
        saveTemplates();
        renderTemplateList();
        displayTemplateDetails(currentTemplate);
    }
});

cancelEditButton.addEventListener('click', function() {
    collapseEditSection();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && editTemplateSection.style.display === 'block') {
        collapseEditSection();
    }
});

deleteTemplateButton.addEventListener('click', function() {
    if (currentTemplate) {
        templates = templates.filter(template => template !== currentTemplate);
        saveTemplates();
        renderTemplateList();
        collapseEditSection();
    }
});

restoreVersionButton.addEventListener('click', function() {
    if (currentTemplate && currentTemplate.versions.length > 0) {
        const lastVersion = currentTemplate.versions.pop();
        currentTemplate.template = lastVersion.template;
        currentTemplate.tags = lastVersion.tags;
        currentTemplate.promptList = lastVersion.promptList;
        saveTemplates();
        renderTemplateList();
        displayTemplateDetails(currentTemplate);
    }
});

filterInput.addEventListener('input', function() {
    const filterText = filterInput.value.toLowerCase();
    const filteredTemplates = templates.filter(template => 
        template.template.toLowerCase().includes(filterText) || 
        template.tags.toLowerCase().includes(filterText)
    );
    renderTemplateList(filteredTemplates);
});

sortSelect.addEventListener('change', function() {
    const sortBy = sortSelect.value;
    if (sortBy === 'date') {
        templates.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'name') {
        templates.sort((a, b) => a.template.localeCompare(b.template));
    }
    renderTemplateList();
});

document.querySelectorAll('.tab-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.tab-content').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(this.dataset.tab).style.display = 'block';
        this.classList.add('active');
    });
});

renderTemplateList();
