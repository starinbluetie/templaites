import { templates, saveTemplates, removeTemplate } from './storage.js';
import { renderTemplateList, displayTemplateDetails, collapseEditSection } from './template.js';
import { currentTemplate, setCurrentTemplate } from './state.js';

const templateForm = document.getElementById('template-form');
const templateInput = document.getElementById('template-input');
const tagsInput = document.getElementById('tags-input');
const promptListInput = document.getElementById('prompt-list-input');
const templateList = document.getElementById('template-list');
const saveChangesButton = document.getElementById('save-changes-button');
const deleteTemplateButtonMain = document.getElementById('delete-template-button-main');
const restoreVersionButton = document.getElementById('restore-version-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
const filterInput = document.getElementById('filter-input');
const sortSelect = document.getElementById('sort-select');
const editTemplateInput = document.getElementById('edit-template-input');
const editTagsInput = document.getElementById('edit-tags-input');
const editPromptListInput = document.getElementById('edit-prompt-list-input');
const editTemplateSection = document.getElementById('edit-template');

templateForm.addEventListener('submit', event => {
    event.preventDefault();
    const newTemplate = {
        template: templateInput.value.trim(),
        tags: tagsInput.value.trim(),
        promptList: promptListInput.value.trim().split('\n').map((item, index) => `${index + 1}. ${item.trim()}`),
        versions: [],
        date: new Date().toISOString()
    };
    templates.push(newTemplate);
    saveTemplates();
    renderTemplateList(templateList);
    templateForm.reset();
});

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

promptListInput.addEventListener('input', function() {
    adjustTextareaHeight(promptListInput);
});

promptListInput.addEventListener('focus', function(event) {
    if (promptListInput.value.trim() === '') {
        promptListInput.value = '1. ';
    }
    adjustTextareaHeight(promptListInput);
});

promptListInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const lines = promptListInput.value.split('\n');
        if (lines[lines.length - 1].trim() === '') return;
        const lastLine = lines[lines.length - 1];
        const lastLineNumber = parseInt(lastLine.split('.')[0], 10) || lines.length;
        const newLineIndex = lastLineNumber + 1;
        lines[lines.length - 1] = `${lastLineNumber}. ${lastLine.split('. ').slice(1).join('. ')}`;
        lines.push(`${newLineIndex}. `);
        promptListInput.value = lines.join('\n');
        const cursorPosition = promptListInput.value.length;
        promptListInput.setSelectionRange(cursorPosition, cursorPosition);
        adjustTextareaHeight(promptListInput);
    }
});

editPromptListInput.addEventListener('input', function() {
    adjustTextareaHeight(editPromptListInput);
});

saveChangesButton.addEventListener('click', function() {
    if (currentTemplate) {
        currentTemplate.versions.push({
            template: currentTemplate.template,
            tags: currentTemplate.tags,
            promptList: currentTemplate.promptList.map(item => item.replace(/^\d+\.\s*/, ''))
        });
        currentTemplate.template = editTemplateInput.value;
        currentTemplate.tags = editTagsInput.value;
        currentTemplate.promptList = editPromptListInput.value.split('\n').map((item, index) => `${index + 1}. ${item.trim()}`);
        saveTemplates();
        renderTemplateList(templateList);
        displayTemplateDetails(currentTemplate);
    }
});

deleteTemplateButtonMain.addEventListener('click', function() {
    if (currentTemplate) {
        if (removeTemplate(currentTemplate)) {
            setCurrentTemplate(null);
            renderTemplateList(templateList);
            collapseEditSection();
        }
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

restoreVersionButton.addEventListener('click', function() {
    if (currentTemplate && currentTemplate.versions.length > 0) {
        const lastVersion = currentTemplate.versions.pop();
        currentTemplate.template = lastVersion.template;
        currentTemplate.tags = lastVersion.tags;
        currentTemplate.promptList = lastVersion.promptList;
        saveTemplates();
        renderTemplateList(templateList);
        displayTemplateDetails(currentTemplate);
    }
});

filterInput.addEventListener('input', () => {
    const filterText = filterInput.value.toLowerCase();
    const filteredTemplates = templates.filter(template => 
        template.template.toLowerCase().includes(filterText) || 
        template.tags.toLowerCase().includes(filterText)
    );
    renderTemplateList(templateList, filteredTemplates);
});

sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    if (sortBy === 'date') {
        templates.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'name') {
        templates.sort((a, b) => a.template.localeCompare(b.template));
    }
    renderTemplateList(templateList);
});

document.querySelectorAll('.tab-item').forEach(item => {
    item.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).style.display = 'block';
        this.classList.add('active');
    });
});
