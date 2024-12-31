+++
title = '{{ replace .File.ContentBaseName `-` ` ` | title }}'
date = '{{ time.Now.Format "2006-01-02" }}'
draft = true
author = "{{ .Site.Params.defaultAuthor }}"
description = "{{ .Site.Params.defaultDescription }}"
tags = []
slug = "{{ .Name | urlize }}"
+++
