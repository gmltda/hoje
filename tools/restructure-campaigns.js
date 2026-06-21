const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const targetDirs = [
  {
    name: 'bolos-caseiros',
    activePath: 'p/index.htm', // Moves p/index.htm to index.html at root
    redirects: ['p/index.htm', 'p/index.html']
  },
  {
    name: 'bolsasnatela',
    activePath: 'index.html' // Already at root
  },
  {
    name: 'bolsaspraianasdecroche',
    activePath: 'index.html' // Already at root
  },
  {
    name: 'bordadolivre',
    activePath: 'index.html' // Already at root
  },
  {
    name: 'hortascaseiras',
    activePath: 'index.html' // Already at root
  },
  {
    name: 'metodo-sapatinho-de-ouro',
    activePath: 'index.html' // Already at root
  },
  {
    name: 'recheios-secretos',
    activePath: 'index.html' // Already at root
  },
  {
    name: 'sapatinhoschic',
    activePath: 'index.html' // Already at root
  },
  {
    name: 'super-receitas-donuts-americanos',
    activePath: 'index.html' // Already at root
  }
];

// Helper to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper to copy directory recursively
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper to move file or directory
function moveItem(src, dest) {
  if (!fs.existsSync(src)) return;
  let finalDest = dest;
  if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) {
    const srcStat = fs.statSync(src);
    if (!srcStat.isDirectory()) {
      finalDest = path.join(dest, path.basename(src));
    }
  }
  const parent = path.dirname(finalDest);
  fs.mkdirSync(parent, { recursive: true });
  try {
    fs.renameSync(src, finalDest);
  } catch (err) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copyDirRecursive(src, finalDest);
      fs.rmSync(src, { recursive: true, force: true });
    } else {
      fs.copyFileSync(src, finalDest);
      fs.unlinkSync(src);
    }
  }
}

// Create redirect HTML code
function createRedirectHTML(targetUrl) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=${targetUrl}">
    <title>Redirecionando...</title>
    <script type="text/javascript">
        // Preserve UTM parameters during redirect
        var currentQuery = window.location.search;
        var destination = "${targetUrl}" + currentQuery;
        window.location.replace(destination);
    </script>
</head>
<body>
    <p>Se você não for redirecionado automaticamente, <a id="redir-link" href="${targetUrl}">clique aqui</a>.</p>
    <script type="text/javascript">
        document.getElementById('redir-link').href = destination;
    </script>
</body>
</html>`;
}

// Find all HTML and HTM files inside a directory (excluding wp-json, feed, assets, etc.)
function getHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      const lowerFile = file.toLowerCase();
      if (lowerFile !== 'wp-json' && lowerFile !== 'feed' && lowerFile !== 'assets' && lowerFile !== 'assets_backup' && lowerFile !== 'index-backup') {
        results = results.concat(getHtmlFiles(filePath));
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.html' || ext === '.htm') {
        results.push(filePath);
      }
    }
  });
  return results;
}

// Master rewrite function for HTML paths
function rewriteHTMLContent(content, depth, cName) {
  const prefix = '../'.repeat(depth);

  // Define asset replacements mapping
  const replacements = [
    // WordPress core system directories
    { old: 'wp-content/', new: 'assets/vendor/wordpress/wp-content/' },
    { old: 'wp-includes/', new: 'assets/vendor/wordpress/wp-includes/' },
    { old: 'wp-json/', new: 'assets/vendor/wordpress/wp-json/' },
    { old: 'comments/', new: 'assets/vendor/wordpress/comments/' },
    { old: 'feed/', new: 'assets/vendor/wordpress/feed/' },
    
    // Other root-level asset directories
    { old: 'npm/', new: 'assets/vendor/npm/' },
    { old: 's/', new: 'assets/vendor/s/' },
    { old: 'u/', new: 'assets/vendor/u/' },
    { old: 'avatar/', new: 'assets/vendor/avatar/' },
    { old: 'gtag/', new: 'assets/vendor/gtag/' },
    { old: 'scripts/', new: 'assets/vendor/scripts/' },
    { old: 'images/', new: 'assets/images/images/' },
    { old: '736x/', new: 'assets/images/736x/' },
    { old: 'tr/', new: 'assets/vendor/tr/' },
    { old: 'tr-1/', new: 'assets/vendor/tr-1/' },
    { old: 'recheios-secretos/', new: 'assets/vendor/recheios-secretos/' },
    
    // Special files moved
    { old: 'css"', new: 'assets/css/css"' },
    { old: 'css\'', new: 'assets/css/css\'' },
    { old: 'css-1"', new: 'assets/css/css-1"' },
    { old: 'css-1\'', new: 'assets/css/css-1\'' }
  ];

  // Perform replacements in content
  replacements.forEach(rep => {
    const regex = new RegExp(`(["'])${escapeRegExp(prefix)}${escapeRegExp(rep.old)}`, 'g');
    content = content.replace(regex, `$1${prefix}${rep.new}`);
  });

  return content;
}

// Rewrite font and relative paths in moved stylesheets
function rewriteStylesheetContent(content) {
  content = content.replace(/url\((['"]?)s\//gi, 'url($1../vendor/s/');
  content = content.replace(/url\((['"]?)wp-content\//gi, 'url($1../vendor/wordpress/wp-content/');
  content = content.replace(/url\((['"]?)wp-includes\//gi, 'url($1../vendor/wordpress/wp-includes/');
  return content;
}

console.log('=== INICIANDO A REESTRUTURAÇÃO DAS NOVAS OFERTAS ===\n');

targetDirs.forEach(c => {
  const cPath = path.join(repoRoot, c.name);
  console.log(`\n==================================================`);
  console.log(`> Processando campanha: ${c.name.toUpperCase()}`);
  if (!fs.existsSync(cPath)) {
    console.log(`  Pasta da campanha não encontrada. Pulando.`);
    return;
  }

  // 1. Criar estrutura de pastas assets
  const assetSubfolders = [
    'assets/css',
    'assets/js',
    'assets/images',
    'assets/videos',
    'assets/fonts',
    'assets/vendor',
    'assets/vendor/wordpress'
  ];
  assetSubfolders.forEach(sub => {
    fs.mkdirSync(path.join(cPath, sub), { recursive: true });
  });

  // 2. Mover pastas do sistema WordPress
  const wpDirs = ['wp-content', 'wp-includes', 'wp-json', 'comments', 'feed'];
  wpDirs.forEach(d => {
    const src = path.join(cPath, d);
    if (fs.existsSync(src)) {
      console.log(`  Movendo pasta WordPress: ${d} -> assets/vendor/wordpress/${d}`);
      moveItem(src, path.join(cPath, 'assets', 'vendor', 'wordpress', d));
    }
  });

  // 3. Mover outras pastas de vendor e assets soltas
  const vendorDirs = ['npm', 's', 'u', 'avatar', 'gtag', 'scripts', 'recheios-secretos'];
  vendorDirs.forEach(d => {
    const src = path.join(cPath, d);
    if (fs.existsSync(src)) {
      console.log(`  Movendo pasta especial: ${d} -> assets/vendor/${d}`);
      moveItem(src, path.join(cPath, 'assets', 'vendor', d));
    }
  });

  const imageDirs = ['images', '736x'];
  imageDirs.forEach(d => {
    const src = path.join(cPath, d);
    if (fs.existsSync(src)) {
      console.log(`  Movendo pasta de imagens: ${d} -> assets/images/${d}`);
      moveItem(src, path.join(cPath, 'assets', 'images', d));
    }
  });

  const cssFiles = ['css', 'css-1'];
  cssFiles.forEach(f => {
    const src = path.join(cPath, f);
    if (fs.existsSync(src) && fs.statSync(src).isFile()) {
      console.log(`  Movendo stylesheet: ${f} -> assets/css/${f}`);
      moveItem(src, path.join(cPath, 'assets', 'css', f));
      
      const stylesheetPath = path.join(cPath, 'assets', 'css', f);
      let sheetContent = fs.readFileSync(stylesheetPath, 'utf8');
      sheetContent = rewriteStylesheetContent(sheetContent);
      fs.writeFileSync(stylesheetPath, sheetContent, 'utf8');
    }
  });

  const otherFiles = ['tr', 'tr-1', 'webcopy-origin.txt'];
  otherFiles.forEach(f => {
    const src = path.join(cPath, f);
    if (fs.existsSync(src)) {
      console.log(`  Movendo arquivo especial: ${f} -> assets/vendor/${f}`);
      moveItem(src, path.join(cPath, 'assets', 'vendor', f));
    }
  });

  // 4. Se a página ativa estava aninhada (ex: p/index.htm), mover para a raiz index.html
  if (c.activePath !== 'index.html' && c.activePath !== 'index.htm') {
    const oldActivePath = path.join(cPath, c.activePath);
    const newActivePath = path.join(cPath, 'index.html');
    if (fs.existsSync(oldActivePath)) {
      console.log(`  Movendo arquivo ativo: ${c.activePath} -> index.html`);
      
      let activeContent = fs.readFileSync(oldActivePath, 'utf8');
      
      // Ajustar caminhos do arquivo que estava aninhado e agora está na raiz
      const attributes = ['src', 'href', 'poster', 'data-src', 'data-background', 'srcset'];
      attributes.forEach(attr => {
        const regex = new RegExp(`(${attr})=(["'])\\.\\.\\/([^"']+)["']`, 'g');
        activeContent = activeContent.replace(regex, '$1="$3"');
      });
      
      fs.writeFileSync(newActivePath, activeContent, 'utf8');
      fs.unlinkSync(oldActivePath);
    }
  }

  // 5. Escanear todos os arquivos HTML e HTM da campanha para atualizar caminhos
  const htmlFiles = getHtmlFiles(cPath);
  console.log(`  Reescrevendo caminhos em ${htmlFiles.length} arquivos HTML...`);
  htmlFiles.forEach(htmlPath => {
    const fileRelPath = path.relative(cPath, htmlPath);
    const fileDepth = fileRelPath.split(path.sep).length - 1;
    
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const updatedHtml = rewriteHTMLContent(htmlContent, fileDepth, c.name);
    fs.writeFileSync(htmlPath, updatedHtml, 'utf8');
    console.log(`     Sucesso: ${fileRelPath} (depth: ${fileDepth})`);
  });

  // 6. Criar os redirecionamentos para as rotas antigas
  if (c.redirects) {
    c.redirects.forEach(red => {
      const redPath = path.join(cPath, red);
      console.log(`  Criando redirecionamento em: ${red} -> /${c.name}/`);
      const redirContent = createRedirectHTML(`/${c.name}/`);
      const redDir = path.dirname(redPath);
      fs.mkdirSync(redDir, { recursive: true });
      fs.writeFileSync(redPath, redirContent, 'utf8');
    });
  }

  console.log(`✓ Campanha ${c.name} reestruturada com sucesso!`);
});

console.log('\n=== REESTRUTURAÇÃO CONCLUÍDA COM SUCESSO! ===');
