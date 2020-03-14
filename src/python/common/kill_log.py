import signal
import sys
import logging

def sigterm_handler(sig, frame):
    sig_name = signal.Signals(sig).name
    logging.error("Killed, signal: %s(%d) frame: %s", sig_name, sig, frame)
    sys.exit(1)


def init_kill_log():
    if init_kill_log.has_run:
        return
    init_kill_log.has_run = True
    for sig in range(1, 8):
        signal.signal(sig, sigterm_handler)
    signal.signal(15, sigterm_handler)

init_kill_log.has_run = False
