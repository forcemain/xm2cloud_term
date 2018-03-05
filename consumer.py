#! -*- coding: utf-8 -*-


from .bridge import BridgeFactory
from channels.handler import AsgiRequest
from channels.auth import http_session


class Proxy(object):
    session = {}


@http_session
def ws_connect(msg):
    request = AsgiRequest(msg)
    request_kwargs = request.GET.dict()

    bridge = BridgeFactory(**request_kwargs)(msg.reply_channel)
    Proxy.session[msg.reply_channel.name] = bridge

    bridge.open(**request_kwargs)


def ws_receive(msg):
    data = msg.content['text']
    Proxy.session[msg.reply_channel.name].web_to_terminal(data)


def ws_disconnect(msg):
    Proxy.session.pop(msg.reply_channel.name)
