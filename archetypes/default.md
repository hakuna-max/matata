+++
title = '{{ replace .File.ContentBaseName `-` ` ` | title }}'
date = "{{ .Date }}"
draft = true
author = "{{ .Site.Params.author }}"
description = "{{ .Site.Params.defaultDescription }}"
tags = []
slug = "{{ .Name | urlize }}"
+++
