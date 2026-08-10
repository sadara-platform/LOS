$urls = @{
    "dashboard_layout" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Q0NmJjMTAxNmUxYzQ4M2FhNjk2ZThiZTU0ZmQwZTIzEgsSBxDosLH3oAcYAZIBIwoKcHJvamVjdF9pZBIVQhM4Mjk0MjU3MDQ4NTcxMzU4NTk5&filename=&opi=96797242"
    "analytics" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFhZjhhMjNiNjIyNzRkZmJhYWY3MjdkMDgwOGRmZDFlEgsSBxDosLH3oAcYAZIBIwoKcHJvamVjdF9pZBIVQhM4Mjk0MjU3MDQ4NTcxMzU4NTk5&filename=&opi=96797242"
    "products" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzJiODEzZGY3YzJmNTQ0MDU5ZGI0NWIyNTQ4YTJmOTdlEgsSBxDosLH3oAcYAZIBIwoKcHJvamVjdF9pZBIVQhM4Mjk0MjU3MDQ4NTcxMzU4NTk5&filename=&opi=96797242"
    "codes" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc2NTNmMmUyM2FjNDQwNmE5OTA0NTJmOGVlYTQxOWE4EgsSBxDosLH3oAcYAZIBIwoKcHJvamVjdF9pZBIVQhM4Mjk0MjU3MDQ4NTcxMzU4NTk5&filename=&opi=96797242"
    "settings" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzk4ZWI4ZDVmZDZhYjRlYzFiMDI0YWIwMTA4MzRmNDg0EgsSBxDosLH3oAcYAZIBIwoKcHJvamVjdF9pZBIVQhM4Mjk0MjU3MDQ4NTcxMzU4NTk5&filename=&opi=96797242"
    "offers" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdlODc5Yjg5M2YzZTQ1ZjRhZDdhZjc3NGY0NzJlZTFhEgsSBxDosLH3oAcYAZIBIwoKcHJvamVjdF9pZBIVQhM4Mjk0MjU3MDQ4NTcxMzU4NTk5&filename=&opi=96797242"
    "cms" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ3NDA2ZTBhMzg4NzRjZWZiODcxNGRkMjFjZWUzODBkEgsSBxDosLH3oAcYAZIBIwoKcHJvamVjdF9pZBIVQhM4Mjk0MjU3MDQ4NTcxMzU4NTk5&filename=&opi=96797242"
}

New-Item -ItemType Directory -Force -Path "./stitch_html"

foreach ($key in $urls.Keys) {
    $url = $urls[$key]
    $file = "./stitch_html/$key.html"
    Invoke-WebRequest -Uri $url -OutFile $file
    Write-Host "Downloaded $key to $file"
}
