// Keeps the view scrolled to the latest line of output
document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    if(!output) return;

    const observer = new MutationObserver(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    observer.observe(output, { childList:true, characterData:true, subtree:true });
});
