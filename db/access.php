<?php
// Capability definitions for tiny_eunitylink plugin

defined('MOODLE_INTERNAL') || die();

$capabilities = [
    'tiny/eunitylink:use' => [
        'captype' => 'write',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'teacher' => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ],
    ],
]; 