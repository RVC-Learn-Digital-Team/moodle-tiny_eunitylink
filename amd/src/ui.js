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

            // Call backend to create the link using the same format as Atto plugin.
            try {
                const response = await fetch(M.cfg.wwwroot + '/local/linkproxy/rest.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'upsert_link',
                        an: accessionnumber,
                        contextid: M.cfg.contextid
                    })
                });
                const responseText = await response.text();
                // Parse JSON after potential deprecation warnings
                const jsonStart = responseText.indexOf('{');
                const jsonText = jsonStart >= 0 ? responseText.substring(jsonStart) : responseText;
                const responseData = JSON.parse(jsonText);

                if (responseData && responseData.result) {
                    // Create the proxy URL using the returned hash.
                    const proxyUrl = M.cfg.wwwroot + '/local/linkproxy/rest.php?action=get_link&hash=' + responseData.result;
                    // Insert the link into the editor.
                    editor.insertContent(`<a href="${proxyUrl}" target="_blank">${linktext}</a>`);
                    api.close();
                } else {
                    window.alert('Failed to create link.');
                }
            } catch (e) {
                window.alert('Error contacting backend: ' + e.message);
            }
        }
    });
}