#! -*- coding: utf-8 -*-


from django.conf.urls import url


from . import views


urlpatterns = [
    url(r'^(?P<protocol>ssh|telnet)/(?P<id>[0-9]+)/$', views.WebTermView.as_view(),
        name='web_terminal'),
]
