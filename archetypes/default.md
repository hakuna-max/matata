+++
title = "{{ replace .Name "-" " " | title }}"  # 动态生成标题，基于文件名
date = {{ .Date }}  # 当前日期时间
draft = true  # 默认草稿状态
author = "{{ .Site.Params.defaultAuthor }}"  # 从配置文件中读取默认作者
description = "{{ .Site.Params.defaultDescription }}"  # 动态读取默认描述
categories = ["{{ .Site.Params.defaultCategory }}"]  # 默认分类
tags = []  # 默认标签为空
featured_image = "{{ .Site.Params.defaultFeaturedImage }}"  # 默认特色图片路径
reading_time = {{ (default 0 .WordCount | div 200 | ceil) }}  # 动态计算阅读时长（假设 200 字/分钟）
slug = "{{ .Name | urlize }}"  # 自动生成 slug，基于文件名
keywords = ["{{ .Site.Params.defaultKeyword }}"]  # 默认关键词
lastmod = {{ .Now }}  # 动态生成最后修改时间
+++
