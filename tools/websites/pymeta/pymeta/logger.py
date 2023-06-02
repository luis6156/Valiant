import os
import sys
import logging

STYLE = {'None': '0',
         'bold': '1'
         }

FG = {'None': '',
      'gray': ';30',
      'red': ';31',
      'green': ';32',
      'yellow': ';33',
      'blue': ';34',
      'purple': ';35',
      'cyan': ';36'
      }


class Log:
    # Quick log class for CLI output
    @staticmethod
    def info(msg):
        print(' '.join([highlight('[*]', 'bold', 'blue'), msg]))

    @staticmethod
    def success(msg):
        print(' '.join([highlight('[+]', 'bold', 'green'), msg]))

    @staticmethod
    def fail(msg):
        print(' '.join([highlight('[-]', 'bold', 'red'), msg]))

    @staticmethod
    def warn(msg):
        print(' '.join([highlight('[*]', 'bold', 'yellow'), msg]))


def code_gen(data, style, color, windows=False):
    return data if windows else '\033[0{}{}m{}\033[0m'.format(STYLE[style], FG[color], data)


def highlight(data, style='bold', fg='blue'):
    return code_gen(data, style, fg, windows=True if os.name == 'nt' else False)


def debug_args(args):
    for k in args.__dict__:
        logging.debug('{:20} => {}'.format(k, args.__dict__[k]))


def setup_debug_logger():
    debug_output_string = "{} %(message)s".format(highlight('DEBUG', fg='purple'))
    formatter = logging.Formatter(debug_output_string)
    streamHandler = logging.StreamHandler(sys.stdout)
    streamHandler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.propagate = False
    root_logger.addHandler(streamHandler)
    root_logger.setLevel(logging.DEBUG)
    return root_logger
