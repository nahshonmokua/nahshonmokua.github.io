async function loadIncludes(root = document) {
    const includeTargets = root.querySelectorAll('[data-include]');

    await Promise.all(
        Array.from(includeTargets).map(async (target) => {
            const source = target.getAttribute('data-include');
            const response = await fetch(source);

            if (!response.ok) {
                throw new Error(`Unable to load include: ${source}`);
            }

            const template = document.createElement('template');
            template.innerHTML = await response.text();
            await loadIncludes(template.content);
            target.replaceWith(template.content);
        })
    );
}

await loadIncludes();

await import('../site.js?v=20260619f');
