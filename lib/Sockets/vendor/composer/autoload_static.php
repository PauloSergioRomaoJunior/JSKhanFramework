<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit0418c4c042c55d4c5914d940fd205659
{
    public static $prefixesPsr0 = array (
        'L' => 
        array (
            'Lazer\\Classes\\' => 
            array (
                0 => __DIR__ . '/..' . '/greg0/lazer-database/src',
            ),
        ),
        'I' => 
        array (
            'Igorw\\EventSource' => 
            array (
                0 => __DIR__ . '/..' . '/igorw/event-source/src',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixesPsr0 = ComposerStaticInit0418c4c042c55d4c5914d940fd205659::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}