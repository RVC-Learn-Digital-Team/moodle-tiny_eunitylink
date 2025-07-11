// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tiny eUnityLink Content configuration.
 *
 * @module      tiny_eunitylink/commands
 * @copyright   2024
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {handleAction} from './ui';
import {get_string as getString} from 'core/str';
import {
    component,
    buttonName,
    icon,
} from './common';

export const getSetup = async() => {
    const [
        buttonText,
        buttonImage,
    ] = await Promise.all([
        getString('buttontitle', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        editor.ui.registry.addIcon(icon, buttonImage.html);
        editor.ui.registry.addToggleButton(buttonName, {
            icon,
            tooltip: buttonText,
            onAction: () => handleAction(editor),
            onSetup: (api) => {
                api.setActive(false); // Placeholder, update for real state
                return () => {};
            },
        });
        editor.ui.registry.addMenuItem(buttonName, {
            icon,
            text: buttonText,
            onAction: () => handleAction(editor),
        });
    };
};