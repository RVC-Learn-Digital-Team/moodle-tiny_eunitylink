<?php
// Tiny eUnityLink plugininfo for Moodle TinyMCE
namespace tiny_eunitylink;

use context;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_menuitems;

class plugininfo extends plugin implements plugin_with_buttons, plugin_with_menuitems {
    public static function get_available_buttons(): array {
        return [
            'tiny_eunitylink/eunitylink',
        ];
    }
    public static function get_available_menuitems(): array {
        return [
            'tiny_eunitylink/eunitylink',
        ];
    }
    public static function is_enabled_for_context(context $context): bool {
        // Only enable if user has the capability in this context.
        return has_capability('tiny/eunitylink:use', $context);
    }
} 