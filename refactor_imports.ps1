
$files = Get-ChildItem -Path "src" -Recurse -File -Include *.ts, *.tsx, *.js, *.json

$replacements = @(
    @{ Old = "modules/common/auth"; New = "modules/core/auth" },
    @{ Old = "common/auth"; New = "core/auth" },

    @{ Old = "modules/common/user-management"; New = "modules/core/iam" },
    @{ Old = "common/user-management"; New = "core/iam" },

    @{ Old = "modules/common/system-config"; New = "modules/core/system-config" },
    @{ Old = "common/system-config"; New = "core/system-config" },

    @{ Old = "modules/common/menu"; New = "modules/core/menu" },
    @{ Old = "common/menu"; New = "core/menu" },

    @{ Old = "modules/common/file-upload"; New = "modules/storage/file-upload" },
    @{ Old = "common/file-upload"; New = "storage/file-upload" },

    @{ Old = "modules/common/about"; New = "modules/introduction/about" },
    @{ Old = "common/about"; New = "introduction/about" },

    @{ Old = "modules/common/faq"; New = "modules/introduction/faq" },
    @{ Old = "common/faq"; New = "introduction/faq" },

    @{ Old = "modules/extra/notification"; New = "modules/core/notification" },
    @{ Old = "extra/notification"; New = "core/notification" },

    @{ Old = "modules/extra/banner"; New = "modules/marketing/banner" },
    @{ Old = "extra/banner"; New = "marketing/banner" },

    @{ Old = "modules/contact"; New = "modules/introduction/contact" },
    @{ Old = "../contact"; New = "../introduction/contact" },

    @{ Old = "modules/rbac"; New = "modules/core/rbac" },
    @{ Old = "../rbac"; New = "../core/rbac" },

    @{ Old = "modules/context"; New = "modules/core/context" },
    @{ Old = "../context"; New = "../core/context" }
)

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw
        $originalContent = $content
        
        foreach ($item in $replacements) {
            # Simple string replacement
            # Note: This is case-insensitive by default in PowerShell
            if ($content -match [Regex]::Escape($item.Old)) {
                $content = $content -replace [Regex]::Escape($item.Old), $item.New
            }
        }

        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Updated: $($file.Name)"
        }
    }
    catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}
