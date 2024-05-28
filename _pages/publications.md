---
layout: archive
title: "Selected Publications"
permalink: /publications/
author_profile: true
---
You can also find the complete list of my articles on <a href="https://scholar.google.com/citations?user=F1weUA8AAAAJ&hl=nl">Google Scholar</a>.

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
