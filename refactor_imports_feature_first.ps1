
$files = Get-ChildItem -Path "src" -Recurse -File -Include *.ts, *.tsx, *.js, *.json

$replacements = @(
    # IAM
    @{ Old = "modules/core/iam/admin/permission"; New = "modules/core/iam/permission/admin" },
    @{ Old = "core/iam/admin/permission"; New = "core/iam/permission/admin" },

    @{ Old = "modules/core/iam/admin/role"; New = "modules/core/iam/role/admin" },
    @{ Old = "core/iam/admin/role"; New = "core/iam/role/admin" },

    @{ Old = "modules/core/iam/admin/user"; New = "modules/core/iam/user/admin" },
    @{ Old = "core/iam/admin/user"; New = "core/iam/user/admin" },

    # Post - Admin
    @{ Old = "modules/post/admin/post"; New = "modules/post/post/admin" },
    @{ Old = "post/admin/post"; New = "post/post/admin" },

    @{ Old = "modules/post/admin/comment"; New = "modules/post/comment/admin" },
    @{ Old = "post/admin/comment"; New = "post/comment/admin" },

    @{ Old = "modules/post/admin/post-category"; New = "modules/post/post-category/admin" },
    @{ Old = "post/admin/post-category"; New = "post/post-category/admin" },

    @{ Old = "modules/post/admin/post-tag"; New = "modules/post/post-tag/admin" },
    @{ Old = "post/admin/post-tag"; New = "post/post-tag/admin" },

    # Post - Public
    @{ Old = "modules/post/public/post"; New = "modules/post/post/public" },
    @{ Old = "post/public/post"; New = "post/post/public" },

    @{ Old = "modules/post/public/comment"; New = "modules/post/comment/public" },
    @{ Old = "post/public/comment"; New = "post/comment/public" },

    @{ Old = "modules/post/public/post-category"; New = "modules/post/post-category/public" },
    @{ Old = "post/public/post-category"; New = "post/post-category/public" },

    @{ Old = "modules/post/public/post-tag"; New = "modules/post/post-tag/public" },
    @{ Old = "post/public/post-tag"; New = "post/post-tag/public" }
)

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw
        $originalContent = $content
        
        foreach ($item in $replacements) {
            # Standard slash
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
