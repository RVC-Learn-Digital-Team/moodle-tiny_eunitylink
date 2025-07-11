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

    // Show TinyMCE dialog with proper form components.
    editor.windowManager.open({
        title,
        body: {
            type: 'panel',
            items: [
                {
                    type: 'input',
                    name: 'linktext',
                    label: linktextLabel,
                    value: selectedText,
                },
                {
                    type: 'input',
                    name: 'accessionnumber',
                    label: accessionLabel,
                }
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
        initialData: {
            linktext: selectedText,
            accessionnumber: ''
        },
        onSubmit: async (api) => {
            const data = api.getData();
            const linktext = data.linktext.trim();
            const accessionnumber = data.accessionnumber.trim();
            
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
                const responseData = await response.json();
                if (responseData && responseData.result && responseData.result.url) {
                    // Insert the link into the editor.
                    editor.insertContent(`<a href="${responseData.result.url}" target="_blank">${linktext}</a>`);
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