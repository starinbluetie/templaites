let templates = JSON.parse(localStorage.getItem('templates')) || [];

function saveTemplates() {
    localStorage.setItem('templates', JSON.stringify(templates));
}
