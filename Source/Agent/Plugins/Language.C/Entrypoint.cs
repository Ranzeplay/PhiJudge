using PhiJudge.Agent.API.Plugin;

namespace PhiJudge.Plugin.Language.C
{
    public class Entrypoint : IPluginEntrypoint
    {
        public string Id => "lang.c";
        public string Name => "Language C";
        public string Description => "C programming language support for PhiJudge";
        public string Author => "Jeb Feng";
        public string Version => "0.1";
        public string[] Dependencies => [];
        public string[] OptionalDependencies => [];

        public string[] SupportedLanguageId => ["c"];

        public void Load()
        {
            throw new NotImplementedException();
        }

        public void Unload()
        {
            throw new NotImplementedException();
        }
    }
}
