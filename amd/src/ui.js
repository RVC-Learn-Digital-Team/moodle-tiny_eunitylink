// UI logic for tiny_eunitylink plugin
import {get_string as getString} from 'core/str';
import {component} from './common';

/**
 * Show the eUnity link dialog, collect data, call backend, and insert link.
 * @param {TinyMCE} editor
 */
export async function handleAction(editor) {
    // Get localized strings.
    const [title, linktextLabel, accessionLabel, createLabel] = await Promise.all([
        getString('dialogtitle', component),
        getString('linktext', component),
        getString('accessionnumber', component),
        getString('createlink', component),
    ]);

    // Get current selection for default link text.
    const selectedText = editor.selection ? editor.selection.getContent({format: 'text'}) : '';

    // Create dialog HTML.
    const dialogHtml = `
        <form id="eunitylink-form" class="tiny-eunitylink-form">
            <div class="form-group">
                <label>${linktextLabel}</label>
                <input type="text" name="linktext" class="form-control" value="${selectedText}" required />
            </div>
            <div class="form-group">
                <label>${accessionLabel}</label>
                <input type="text" name="accessionnumber" class="form-control" required />
            </div>
        </form>
    `;

    // Show TinyMCE dialog.
    editor.windowManager.open({
        title,
        body: {
            type: 'panel',
            items: [
                {type: 'htmlpanel', html: dialogHtml}
            ]
        },
        buttons: [
            {
                type: 'cancel',
                text: 'Cancel'
            },
            {
                type: 'submit',
                text: createLabel,
                primary: true
            }
        ],
        initialData: {},
        onSubmit: async (api) => {
            // Get form values from DOM.
            const form = document.querySelector('#eunitylink-form');
            const linktext = form.linktext.value.trim();
            const accessionnumber = form.accessionnumber.value.trim();
            if (!linktext || !accessionnumber) {
                // Optionally show error
                return;
            }
            // Call backend to get/proxy the link.
            try {
                const response = await fetch(M.cfg.wwwroot + '/local/linkproxy/rest.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({
                        action: 'get_dbvals',
                        accessionnumber,
                        contextid: M.cfg.contextid
                    })
                });
                const data = await response.json();
                if (data && data.result && data.result.url) {
                    // Insert the link into the editor.
                    editor.insertContent(`<a href="${data.result.url}" target="_blank">${linktext}</a>`);
                    api.close();
                } else {
                    window.alert('Failed to create link.');
                }
            } catch (e) {
                window.alert('Error contacting backend.');
            }
        }
    });
} 