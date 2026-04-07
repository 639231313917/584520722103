const nameInput = document.getElementById('nameInput');
const titleInput = document.getElementById('titleInput');
const outputCode = document.getElementById('outputCode');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

const customSelect = document.getElementById('customSelect');
const profileSelectTrigger = document.getElementById('profileSelectTrigger');
const customOptionsContainer = document.getElementById('customOptionsContainer');

let template = '';
let profiles = [];

async function init() {
    try {
        const tplRes = await fetch('template.html');
        template = await tplRes.text();

        const profRes = await fetch('profiles.json');
        profiles = await profRes.json();

        populateProfiles();
        updateCode();
    } catch (error) {
        console.error(error);
        outputCode.value = "Error loading files.";
    }
}

function populateProfiles() {
    profiles.forEach((profile, index) => {
        const option = document.createElement('div');
        option.classList.add('custom-option');
        
        option.innerHTML = `<span style="color: #ffffff;">${profile.name}</span> <span style="color: #9e9e9e;">- ${profile.title}</span>`;
        
        option.addEventListener('click', function() {
            const allOptions = document.querySelectorAll('.custom-option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            
            this.classList.add('selected');
            profileSelectTrigger.innerHTML = this.innerHTML;
            customOptionsContainer.classList.remove('open');
            
            nameInput.value = profile.name;
            titleInput.value = profile.title;
            updateCode();
        });

        customOptionsContainer.appendChild(option);
    });
}

function updateCode() {
    if (!template) return;
    const name = nameInput.value || 'Name not specified';
    const title = titleInput.value || 'Title not specified';
    
    const finalCode = template
        .replace('{{NAME}}', name)
        .replace('{{TITLE}}', title);
        
    outputCode.value = finalCode;
}

profileSelectTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    customOptionsContainer.classList.toggle('open');
});

window.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        customOptionsContainer.classList.remove('open');
    }
});

nameInput.addEventListener('input', updateCode);
titleInput.addEventListener('input', updateCode);

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputCode.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    });
});

downloadBtn.addEventListener('click', () => {
    if (!outputCode.value) return;
    
    const name = nameInput.value.trim() || 'signature';
    const filename = `${name}.html`;
    const blob = new Blob([outputCode.value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

init();