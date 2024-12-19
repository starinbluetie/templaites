export let templates = JSON.parse(localStorage.getItem('templates')) || [];

export function saveTemplates() {
    localStorage.setItem('templates', JSON.stringify(templates));
}

export function removeTemplate(template) {
    const index = templates.indexOf(template);
    if (index > -1) {
        templates.splice(index, 1);
        saveTemplates();
        return true;
    }
    return false;
}
