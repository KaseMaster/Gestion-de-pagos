<?php
// Installer script for cPanel

// Function to create necessary directories
function createDirectories() {
    $directories = ['static', 'static/css', 'static/js', 'templates', 'templates/partials'];
    foreach ($directories as $dir) {
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
    }
}

// Function to download files from GitHub
function downloadFiles() {
    $files = [
        'main.py' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/main.py',
        'app_init.py' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/app_init.py',
        'routes.py' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/routes.py',
        'requirements.txt' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/requirements.txt',
        'static/css/styles.css' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/static/css/styles.css',
        'static/js/script.js' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/static/js/script.js',
        'templates/home.html' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/templates/home.html',
        'templates/partials/_header.html' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/templates/partials/_header.html',
        'templates/partials/_desktop_header.html' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/templates/partials/_desktop_header.html',
        'templates/partials/_mobile_header.html' => 'https://raw.githubusercontent.com/yourusername/yourrepo/main/templates/partials/_mobile_header.html'
    ];

    foreach ($files as $file => $url) {
        $content = file_get_contents($url);
        if ($content !== false) {
            file_put_contents($file, $content);
        } else {
            echo "Error downloading $file<br>";
        }
    }
}

// Function to set up Python environment
function setupPythonEnvironment() {
    exec('python3 -m venv venv');
    exec('source venv/bin/activate && pip install -r requirements.txt');
}

// Function to create .htaccess file
function createHtaccess() {
    $htaccess = <<<EOT
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:8080/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ http://127.0.0.1:8080/$1 [P,L]
EOT;

    file_put_contents('.htaccess', $htaccess);
}

// Main installation process
createDirectories();
downloadFiles();
setupPythonEnvironment();
createHtaccess();

echo "Installation completed successfully!";
?>