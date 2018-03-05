#! -*- coding: utf-8 -*-


import sys


_PLATFORM = sys.platform


class Platform(object):

    @staticmethod
    def detail():
        return _PLATFORM

    @staticmethod
    def is_win():
        return _PLATFORM.startswith('win')

    @staticmethod
    def is_linux():
        return _PLATFORM.startswith('linux')

    @staticmethod
    def is_mac():
        return _PLATFORM.startswith('darwin')


class Switch(object):
    def __init__(self, v):
        self._v = v

    def __iter__(self):
        yield self.case

    def case(self, *args):
        if not args:
            return True
        return self._v in args
