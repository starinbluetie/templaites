export let templates = JSON.parse(localStorage.getItem('templates')) || [];

export function saveTemplates() {
    localStorage.setItem('templates', JSON.stringify(templates));
}
