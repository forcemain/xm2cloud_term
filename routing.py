#! -*- coding: utf-8 -*-


from . import consumer


channel_routing = {
    'websocket.connect': consumer.ws_connect,
    'websocket.receive': consumer.ws_receive,
    'websocket.disconnect': consumer.ws_disconnect
}
