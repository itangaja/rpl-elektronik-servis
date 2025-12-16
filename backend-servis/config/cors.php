<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Di production sebaiknya spesifik, tapi untuk awal '*' oke, atau gunakan 'allowed_origins_patterns' => ['https://*.vercel.app']
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
