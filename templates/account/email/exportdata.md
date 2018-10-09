Hi {{user.fullname}},

You have recently requested to export all the data that we have from you in our server.

{% if personal_data_link %}
In the following links, you will be able to download ZIP files that contains your personal data (the links will be only valid for {{config.TTL_ZIP_SEC_FILES}} days).

Personal Data: {{personal_data_link}}
{% else %}
Attached you will find a ZIP file that contains your personal data.
{% endif %}

Within the ZIP file you will find your data in JSON format. You can open those files with any text editor, as this format is an open standard.

If you want to get new updated versions of the file, just export again your data.

All the best,

{{ config.BRAND }} Team
