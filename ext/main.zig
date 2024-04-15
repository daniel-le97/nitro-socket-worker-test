const std = @import("std");

const extension = @cImport({
    @cInclude("../../../../../../../../../../../Users/daniel/homelab/GitHub/languages/javascript/nitro-app/ext/extension.h");
});

const SapiContext = extern struct {
    c: *extension.sapi_context_t,
};

const SapiProcessExec = extern struct {
    c: *extension.sapi_process_exec_t,
};

const SapiProcessSpawn = extern struct {
    c: *extension.sapi_process_spawn_t,
};

pub fn process_exec(context: *SapiContext, command: []const u8) !SapiProcessExec {
    var process: SapiProcessExec = undefined;
    const commandCStr = command.?ptr;
    defer std.c.free(commandCStr);

    process.c = extension.sapi_process_exec(context.c, commandCStr);
    if (process.c == null) {
        return error."Failed to execute process";
    }

    return process;
}

pub fn process_exec_get_exit_code(process: *SapiProcessExec) i32 {
    return extension.sapi_process_exec_get_exit_code(process.c);
}

pub fn process_exec_get_output(process: *SapiProcessExec) []const u8 {
    const outputCStr = extension.sapi_process_exec_get_output(process.c);
    return std.mem.slice(outputCStr, 0, std.mem.len(outputCStr) - 1);
}

pub fn process_spawn(
    context: *SapiContext,
    command: []const u8,
    argv: []const u8,
    path: []const u8,
    onstdout: extern "C" fn(*extension.sapi_process_spawn_t, *u8, u32),
    onstderr: extern "C" fn(*extension.sapi_process_spawn_t, *u8, u32),
    onexit: extern "C" fn(*extension.sapi_process_spawn_t, i32),
) !SapiProcessSpawn {
    var process: SapiProcessSpawn = undefined;
    const commandCStr = command.?ptr;
    const argvCStr = argv.?ptr;
    const pathCStr = path.?ptr;
    defer std.c.free(commandCStr);
    defer std.c.free(argvCStr);
    defer std.c.free(pathCStr);

    process.c = extension.sapi_process_spawn(
        context.c,
        commandCStr,
        argvCStr,
        pathCStr,
        onstdout,
        onstderr,
        onexit,
    );
    if (process.c == null) {
        return error."Failed to spawn process";
    }

    return process;
}

// Usage example
pub fn main() !void {
    var allocator = std.heap.page_allocator;
    var context: SapiContext = undefined;
    context.c = std.c.malloc(allocator, @sizeOf(extension.sapi_context_t));
    defer std.c.free(context.c);

    // Initialize the context
    // ...

    // Execute a process
    const command = "ls";
    var processExec = try process_exec(&context, command);
    defer extension.sapi_process_exec_free(processExec.c);

    // Get the exit code
    const exitCode = process_exec_get_exit_code(&processExec);
    std.debug.print("Exit code: {}\n", .{exitCode});

    // Get the output
    const output = process_exec_get_output(&processExec);
    std.debug.print("Output: {}\n", .{output});
}
